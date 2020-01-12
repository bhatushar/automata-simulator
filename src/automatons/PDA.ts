import {AutomataAPI, AutomataData, GraphData} from "../Interfaces";
import {Automata} from "./Automata";
import {Colors} from "../Colors";

// t[q][i][x] = {q', y}, {q'', z}...
interface PDATransition {
    [state: string]: {
        [input: string]: {
            [stackTop: string]: {
                nextState: string,
                stackReplace: string
            }[]
        }
    }
}

interface OrderStackElement {
    q: string,
    i: number,
    stackTop: string,
    stackReplace: string,
    parent: number | undefined
}

export class PDA extends Automata implements AutomataAPI {
    private static readonly NULL = "null";
    private static readonly STACK_START = "Z";
    private readonly transitions: PDATransition;

    constructor (data: AutomataData) {
        super(data);

        // Regex for matching the right-hand side of the transitions
        // (state, stack) [(state, stack)...]
        const transitionRHS_re = "(" + // Matching the entire right-side in one group
            "(\\s*" + // Ignore any preceding whitespace and start group matching
            "\\(\\s*([a-zA-Z0-9]+)" + // Match literal '(' followed by a state name (also captured in a group)
            "\\s*,\\s*" + // Read until , (comma)
            "([a-zA-Z0-9]+)" + // Following the comma is the stack symbol
            "\\s*\\)" + // Ignore any whitespaces before closing parenthesis ')'
            ")+" + // Repeat one or more times
            ")$"; // End group at line end
        // CurrentState, Input, StackTop = (NextState, StackReplace) [(NextState, StackReplace)...]
        const transitions_re = new RegExp(
            "^\\s*([a-zA-Z0-9]+)\\s*," + // Read current state until , (comma)
            "\\s*([a-zA-Z0-9]+)\\s*," + // Read input until , (comma)
            "\\s*([a-zA-Z0-9]+)\\s*=" + // Read stack top symbol until = (equals symbol)
            transitionRHS_re);

        // Initialize transitions object
        this.transitions = {};
        // Initialize transitions[q] for all states q
        this.states.forEach(q => this.transitions[q] = {});
        // Loop over individual transitions
        data.transitions.split('\n').forEach(t_str => {
            const matches = t_str.match(transitions_re);
            if (matches) {
                // Match successful
                // Extract relevant LHS parameters from the matches
                const currentState = matches[1], input = matches[2], stackTopCharacter = matches[3];
                // Continue if the state exists
                if (this.states.has(currentState)) {
                    // pairs[] = ["nextState, stackReplaceCharacter", ...]
                    const pairs = matches[4].split(')') // Split on the closing parenthesis
                        .map(pair => pair.trim() // "   (  q, x" => "(  q, x"
                            .substring(1)); // "(  q, x" => "  q, x"
                    // Loop over individual pair
                    pairs.forEach(pair => {
                        // pair_arr[2] = ["nextState", "stackReplaceCharacter"]
                        const pair_arr = pair.split(',') // Split on the comma
                            .map(p => p.trim()); // Trim any possible whitespace on individual parameters
                        // Fit the pair in the transitions object only if the nextState exists in states set
                        if (this.states.has(pair_arr[0])) {
                            // Make sure transitions[q][i] is defined
                            if (!this.transitions[currentState][input])
                                this.transitions[currentState][input] = {};
                            // Make sure transitions[q][i][x] is defined
                            if (!this.transitions[currentState][input][stackTopCharacter])
                                this.transitions[currentState][input][stackTopCharacter] = [];
                            // Make sure the (nextState, stackReplaceCharacter) isn't repeated
                            let repeated: boolean = false;
                            this.transitions[currentState][input][stackTopCharacter].every(object => {
                                if (object.nextState === pair_arr[0] && object.stackReplace === pair_arr[1]) {
                                    repeated = true;
                                    return false;
                                }
                            });
                            if (!repeated)
                                // Add (q, x) pair to the transition
                                this.transitions[currentState][input][stackTopCharacter].push({
                                    nextState: pair_arr[0],
                                    stackReplace: pair_arr[1]
                                });
                        }
                    });
                }
            }
        });
    }

    public getGraphData(): GraphData {
        const graphData = super.getGraphData();

        for (let q in this.transitions)
            for (let i in this.transitions[q])
                for (let x in this.transitions[q][i])
                    this.transitions[q][i][x].forEach(({nextState: s, stackReplace: y}) =>
                        graphData.linkDataArray.push({
                            from: q,
                            to: s,
                            label: `${i}, ${x}/${y}`, // i, x/y
                            key: `(${q},${i},${x})/(${s},${y})`, // (q,i,x)/(s,y)
                            color: Colors.link
                        })
                    );

        return graphData;
    }

    public run(input: string, separator: '' | '\n'): {newGraph: GraphData, result: string} {
        const input_arr = input.split(separator);
        const pdaStack = new Stack<string>();
        const orderStack = new Stack<OrderStackElement>();
        let acceptedStateReached: OrderStackElement | undefined;

        pdaStack.push(PDA.STACK_START);
        orderStack.push({
            q: this.initialState, i: 0,
            stackTop: PDA.NULL, stackReplace: PDA.NULL, parent: undefined
        });

        while (orderStack.size() > 0) {
            let parent = orderStack.peek(),
                parent_i = orderStack.size() - 1;
            let i = parent.i;
            if (i === input_arr.length) {
                const el = orderStack.pop();
                if (this.acceptedStates.has(el.q)) {
                    acceptedStateReached = el;
                    break;
                }
                else {
                    // Undo
                    PDA.doStack(pdaStack, el.stackReplace, el.stackTop);
                    parent = orderStack.peek();
                    parent_i--;
                    PDA.doStack(pdaStack, parent.stackTop, parent.stackReplace);
                }
            }
            const top = (pdaStack.size() > 0) ? pdaStack.peek() : PDA.NULL;
            const delta = this.transitions[parent.q];

            if (i < input_arr.length && delta[input_arr[i]][top])
                delta[input_arr[i]][top].forEach(pair => {
                    orderStack.push({
                        q: pair.nextState,
                        i: i + 1,
                        stackTop: top,
                        stackReplace: pair.stackReplace,
                        parent: parent_i
                    });
                });
            if (delta[PDA.NULL][top])
                delta[PDA.NULL][top].forEach(pair => {
                    const element = {
                        q: pair.nextState,
                        i: i,
                        stackTop: top,
                        stackReplace: pair.stackReplace,
                        parent: parent_i
                    };
                    if (!PDA.existsUpward(element, orderStack))
                        orderStack.push(element);
                });

            if (parent_i === orderStack.size() - 1)
                PDA.backtrack(orderStack, pdaStack);

            if (orderStack.size() > 1) {
                const {stackTop, stackReplace} = orderStack.peek();
                PDA.doStack(pdaStack, stackTop, stackReplace);
            }
        }

        if (acceptedStateReached) {
            console.log(acceptedStateReached);
            while (acceptedStateReached.parent) {
                acceptedStateReached = orderStack.at(acceptedStateReached.parent);
                console.log(acceptedStateReached);
            }
        }
        else console.log("Rejected");

        return {newGraph: this.getGraphData(), result: ""};
    }

    private static doStack(pdaStack: Stack<string>, original: string, replacement: string) {
        if (original !== PDA.NULL) pdaStack.pop();
        if (replacement !== PDA.NULL) pdaStack.push(replacement);
    }

    private static backtrack(orderStack: Stack<OrderStackElement>, pdaStack: Stack<string>) {
        if (orderStack.size() === 0) return;
        let i: OrderStackElement;
        do {
            i = orderStack.pop() as OrderStackElement;
            PDA.doStack(pdaStack, i.stackReplace, i.stackTop);
        } while (i.parent === orderStack.size() - 1);
    }

    private static existsUpward(element: OrderStackElement, orderStack: Stack<OrderStackElement>): boolean {
        if (orderStack.size() === 0) return false;
        let index: number | undefined = orderStack.size() - 1;
        let exists = false;
        do {
            const temp = orderStack.at(index);
            if (element.q === temp.q && element.i === temp.i &&
                element.stackTop === temp.stackTop && element.stackReplace === temp.stackReplace)
                exists = true;
            index = temp.parent;
        } while (index && !exists);
        return exists;
    }
}

class Stack<T> {
    private readonly list: T[];
    constructor() { this.list = []; }
    public push(el: T) { this.list.push(el); }
    public pop(): T { return this.list.pop() as T; }
    public peek(): T { return this.list[this.list.length - 1]; }
    public size(): number { return this.list.length; }
    public at(i: number): T { return this.list[i]; }
}