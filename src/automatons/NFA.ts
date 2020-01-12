import {AutomataAPI, AutomataData, GraphData} from "../Interfaces";
import {Automata} from "./Automata";
import {Colors} from "../Colors";

/**
 * Transition function: T(currentState, input) = <nextState, ...>
 * The object can be accessed as: T["currentState"]["input"] = Set of next states
 */
interface NFATransition {
    [state: string]: { [input: string]: Set<string> }
}

/**
 * Non-deterministic Finite Automata
 * Formal definition: M = (Q, E, t, q, F)
 * where, Q is a finite set of states
 *        E is a finite set of input alphabet
 *        t is a transition function
 *        q is the initial state
 *        F is a subset of Q, a set of accepted states
 * t: (Q x {E + NULL}) -> PowerSet(Q)
 */
export class NFA extends Automata implements AutomataAPI {
    /**
     * Used for null-transitions.
     * A null-transition is made when NFA makes a transition without reading any input from the tape.
     */
    private static readonly NULL = "null";
    private readonly transitions: NFATransition;

    constructor(data: AutomataData) {
        super(data);

        // Format: currentState, input = nextState1 [, nextState2...]
        // Ignores any whitespace
        const transitions_re = new RegExp(
            "^\\s*([a-zA-Z0-9]+)\\s*," + // Read current state until , (comma)
            "\\s*([a-zA-Z0-9]+)\\s*=" + // Read input until = (equals symbol)
            "\\s*([0-9a-zA-Z]+" + // There must be at least one next state
            "(\\s*,\\s*[0-9a-zA-Z]+)*)" + // Additional next states are optional and are separated by comma
            "\\s*$"); // Match until the end of line

        this.transitions = {};
        // Define transition for every state
        this.states.forEach(q => this.transitions[q] = {});
        data.transitions.split('\n').forEach(t_str => {
            // Looping over individual transitions
            const matches = t_str.match(transitions_re);
            if (matches) {
                // Assigning respective matches
                const currentState = matches[1], input = matches[2];
                // Check that currentState exists
                if (this.states.has(currentState)) {
                    // Creating an array of next states with trimmed whitespaces.
                    let nextStates = matches[3] // "q1, q2, q3"
                        .split(',')  // ["q1", " q2", " q3"]
                        .map(q => q.trim());   // ["q1", "q2", "q3"]
                    // Filtering out valid next states
                    nextStates = nextStates.filter(q => this.states.has(q));
                    this.transitions[currentState][input] = new Set<string>(nextStates);
                }
            }
        });
    }

    public getGraphData(): GraphData {
        const graphData = super.getGraphData();
        // Loop over every T[q][i][qNext] transition
        for (let q in this.transitions)
            for (let i in this.transitions[q])
                this.transitions[q][i].forEach(qNext =>
                    // Add link
                    graphData.linkDataArray.push({
                        from: q,
                        to: qNext,
                        label: i,
                        key: `(${q},${i})/${qNext}`, // (q,i)/qNext
                        color: Colors.link
                    })
                );
        return graphData;
    }

    /**
     * NFA works on non-determinism, meaning that at each state it has an option to either read an input or not. Based
     * on the decision it then decides which corresponding transition to make. If an input was read, the automata moves
     * to the next input otherwise it remains on the same input. If no input was read, the transition made is a
     * null-transition. Because of non-determinism, the NFA can in at multiple states at once.
     * Every (q,i) pair may have multiple transitions.
     *
     * I'm implementing NFA using an InvertedTree and a Queue. In the tree, a child node is reached by making a
     * transition from parent node's state. The queue holds the nodes in the order they should be processed. This
     * approach somewhat similar to the breadth-first search in graphs.
     *
     * @param input
     * @param separator
     */
    public run(input: string, separator: '' | '\n'): {newGraph: GraphData, result: string} {
        const input_arr = input.split(separator);
        // Contains nodes in the order of evaluation
        const orderQueue = new Queue<TreeNode>();
        // Initializing tree with root node as initialState
        const T = new InvertedTree(this.initialState);
        // node object will hold the element in the front of orderQueue
        let node: TreeNode | undefined = T.getRoot();
        // Contains an accepted state if it can be reached with the given input
        let acceptedNode: TreeNode | undefined;
        // Contains all the states that can be accessed from a given transition (q, i)
        let stateSet: Set<string>;

        // To start, add the root to the queue
        orderQueue.push(node);
        // Loop until queue is empty or an accepted state is reached
        while ((node = orderQueue.pop()) && acceptedNode === undefined) {
            // Doing this because the function inside forEach loops don't consider node type-safe
            const x: TreeNode = node;
            // Get all states that accessed from a (q, input[i]) transition
            if ((stateSet = this.transitions[x.q][input_arr[x.i]]))
                stateSet.forEach(q => {
                    // Add all transitioning states to the tree with their respective input index
                    const z = T.add(q, x.i + 1, x);
                    // Check if an accepted state is reached
                    // true if the state reached after reading the entire input
                    if (z.i === input_arr.length && this.acceptedStates.has(z.q))
                        acceptedNode = z;
                    else orderQueue.push(z);
                });
            // Get all null transitions from q
            if ((stateSet = this.transitions[x.q][NFA.NULL]))
                stateSet.forEach(q => {
                    /* This is where the InvertedTree really shines.
                       The general idea is that if a node (q, i) exists on a simple path from leaf to root, then the
                       same node cannot be added. The reasoning behind this is that if another (q, i) is found, the
                       result processed by adding this new node will be the same as the one obtained from the original
                       node.
                       In addition to that, removing all duplicates from a simple path eliminates the chances of falling
                       in a null-loop.
                     */
                    if (!T.existsUpward(q, x.i, x)) {
                        // Add the new node if it doesn't already exist
                        // i remains unchanged because nothing was read from the tape
                        const z = T.add(q, x.i, x);
                        // Same condition as before to check if an accepted state is reached
                        if (z.i === input_arr.length && this.acceptedStates.has(z.q))
                            acceptedNode = z;
                        else orderQueue.push(z);
                    }
                });
        }

        // Construct result
        let result: string;
        const newGraph = this.getGraphData();

        if (acceptedNode) {
            // Accepted state was reached; get the path
            // acceptedNode will be used as an iterator variable in the loop below
            result = "Accepted\n\nPATH WALKED:";
            // Records all the transitions that were made to reach the accepted state
            const walked: NFATransition = {};
            // Records the actual, ordered path taken by the NFA
            let path: string = "";
            // Holds the value of acceptedNode.q from the last iteration
            let childState: string | undefined;
            // Holds the value of acceptedNode.i from the last iteration
            let last_i: number | undefined;
            // Loop until the root is reached
            do {
                const {q, i} = acceptedNode;
                if(!walked[q]) walked[q] = {};

                // childState is the state that will be reached from (q, i) transition
                if (childState) {
                    // If i is same in 2 successive iteration, then a null transition was made
                    const input_i = (i === last_i) ? NFA.NULL : input_arr[i];
                    // Record transition
                    if (!walked[q][input_i]) walked[q][input_i] = new Set<string>();
                    walked[q][input_i].add(childState);
                    // Evaluating bottom-up
                    path = `\n(${q}, ${input_i}) = ${childState}` + path;
                }
                // Update for next iteration
                childState = q;
                last_i = i;
                acceptedNode = acceptedNode.p;
            } while (acceptedNode);
            // Append path to the result so the user can see it
            result += path;
            // Update the graph to indicate the path walked
            newGraph.nodeDataArray.forEach(node => {
                if (walked[node.key]) node.color = Colors.walked;
            });
            newGraph.linkDataArray.forEach(link => {
                if (walked[link.from] && walked[link.from][link.label] && walked[link.from][link.label].has(link.to))
                    link.color = Colors.walked;
            });
        }
        // If input is rejected, the graph will not be changed
        else result = "Rejected";

        return {newGraph, result};
    }
}

/**
 * Self-referential node
 * Contains an object attribute of type T, and a next attribute which points to another node of same type.
 * Used as queue elements.
 */
interface Node <T> {
    object: T,
    next: Node<T> | undefined
}

/**
 * Custom implementation of linked-list queue because Array.shift() takes O(n) time.
 * This implementation has only two operations - push and pop.
 */
class Queue <T> {
    private front: Node<T> | undefined;
    private rear: Node<T> | undefined;

    public push(object: T) {
        const node: Node<T> = {object, next: undefined};
        if (this.rear) {
            // Queue has already been initialized
            this.rear.next = node;
            this.rear = this.rear.next;
        }
        else
            // Initialize queue
            this.front = this.rear = node;
    }

    public pop(): T | undefined {
        if (!this.front)
            // Empty queue
            return undefined;
        const node: Node<T> = this.front;
        if (!this.front.next)
            // Only one item left in queue prior to deletion, unset rear pointer
            this.rear = undefined;
        this.front = this.front.next;
        return node.object;
    }
}

/**
 * A node of the InvertedTree object.
 * q is the name of the state.
 * i is the index of the input which state q might read (q might make a null transition).
 * p is the parent of the node, i.e., the state from which q was reached.
 */
interface TreeNode {
    q: string,
    i: number,
    p: TreeNode | undefined
}

/**
 * An rooted inverted tree implementation where the child points to it's parent.
 */
class InvertedTree {
    // Root of the tree, set in constructor
    private readonly root: TreeNode;

    /**
     * @param q Root/initial state
     */
    constructor(q: string) { this.root = { q, i: 0, p: undefined }; }

    /**
     * @return TreeNode Root of the tree
     */
    public getRoot(): TreeNode { return this.root; }

    /**
     * Adds a node to the tree under the given parent
     *
     * @param q Automata state
     * @param i Input index
     * @param parent
     * @return TreeNode Newly added node
     */
    public add(q: string, i: number, parent: TreeNode): TreeNode { return { q, i, p: parent }; }

    /**
     * Checks if a node with (q, i) exists in the path from, and including, node to the root.
     * @param q Automata state
     * @param i Input index
     * @param node Node to start searching from
     * @return boolean True if a duplicate node is found
     */
    public existsUpward(q: string, i: number, node: TreeNode): boolean {
        let temp: TreeNode | undefined = node;
        /* From leaf to root, i is stored in non-increasing manner since NFA only moves forward on the input tape.
           To increase efficiency, we can stop the search once the value of temp.i changes instead of going all the way
           to the root every time.
         */
        while (temp && temp.i === i) {
            if (temp.q === q) return true;
            temp = temp.p;
        }
        return false;
    }
}