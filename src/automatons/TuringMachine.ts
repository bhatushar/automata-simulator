import {Automata} from "./Automata";
import {AutomataAPI, AutomataData, GraphData} from "../Interfaces";
import {Colors} from "../Colors";

/**
 * Transition function: T(currentState, input) = (nextState, output, direction)
 * The object can be accessed as: T["currentState"]["input"] = { nextState, output, direction }
 */
interface TuringMachineTransition {
    [state: string]: {
        [input: string]: {
            nextState: string,
            output: string,
            direction: string
        }
    }
}

/**
 * One automata to compute them all.
 * Formal definition, M = (Q, G, b, E, t, q, F)
 * where, Q is a finite set of states
 *        G is a finite set of tape alphabet
 *        b is a blank symbol, belongs to G
 *        E is a finite set of input alphabet, subset of G - {b}
 *        t is a transition function
 *        q is the initial state
 *        F is a subset of Q, a set of accepted states
 * t: (Q x G) -> (Q x G x {L, R})
 */
export class TuringMachine extends Automata implements AutomataAPI {
    private readonly transitions: TuringMachineTransition;
    private readonly MOVE_LEFT = "L";
    private readonly MOVE_RIGHT = "R";
    private readonly BLANK = "B";

    constructor (data: AutomataData) {
        super(data);
        // For states, tape symbol and direction
        const alphanumeric_re = "([a-zA-Z0-9]+)";
        // Format: currentState, tapeInput = nextState, tapeOutput, direction
        // Ignores whitespaces
        const transitions_re = "^\\s*" + alphanumeric_re + // currentState
        "\\s*,\\s*" + alphanumeric_re + // tapeInput
        "\\s*=\\s*" + alphanumeric_re + // nextState
        "\\s*,\\s*" + alphanumeric_re + // tapeOutput
        `\\s*,\\s*(${this.MOVE_LEFT}|${this.MOVE_RIGHT})` + // left/right
        "\\s*$";

        this.transitions = {};
        // Define transition for every state
        this.states.forEach(q => this.transitions[q] = {});
        data.transitions.split('\n').forEach(t_str => {
            // Iterate over individual transitions
            const matches = t_str.match(transitions_re);
            if (matches) {
                // Assign respective matches
                const currentState = matches[1], input = matches[2],
                    nextState = matches[3], output = matches[4], direction = matches[5];
                if (this.states.has(currentState) && this.states.has(nextState))
                    // Create transition is current and next states exist
                    this.transitions[currentState][input] = {
                        nextState, output, direction
                    }
            }
        });
    }


    public getGraphData(): GraphData {
        const graphData = super.getGraphData();
        // Loop over every T[q][i] transition
        for (let q in this.transitions)
            for (let i in this.transitions[q]) {
                // Add link
                graphData.linkDataArray.push({
                    from: q,
                    to: this.transitions[q][i].nextState,
                    label: `${i}/${this.transitions[q][i].output}, ${this.transitions[q][i].direction}`, // input/output, direction
                    key: `(${q},${i})`, // (q,i)
                    color: Colors.link
                });
            }
        return graphData;
    }

    /**
     * Turing Machine works the same way as a DFA; by reading an input and making a corresponding transition.
     * In addition to that, Turing Machine can perform two additional operations. It can overwrite the tape input and
     * move the tape header left or right.
     *
     * @param input
     * @param separator
     */
    public run(input: string, separator: '' | '\n'): {newGraph: GraphData, result: string} {
        let input_arr = input.split(separator);
        // If input tape is empty, store B to represent blank symbol
        if (input_arr.length == 0) input_arr = [this.BLANK];
        // Input iterator
        let i = 0;
        // State iterator
        let state_i = this.initialState;
        // Records all the transitions that were made
        // linkLabel is the same as the label attribute of a linkDataArray element.
        const walked: { [state: string]: { [linkLabel: string]: string } } = {};
        // Records the ordered path
        let path: string = "";

        // Since Turing Machine doesn't have an explicit halting condition, continue as long as a transition can be made
        while (this.transitions[state_i][input_arr[i]]) {
            const {nextState, output, direction} = this.transitions[state_i][input_arr[i]];
            // Record path
            if (!walked[state_i]) walked[state_i] = {};
            const label = `${input_arr[i]}/${output}, ${direction}`;
            walked[state_i][label] = nextState;
            path += `(${state_i}, ${input_arr[i]}) = ${nextState}, ${output}, ${direction}\n`;
            // Update tape
            input_arr[i] = output;
            // Moving tape header
            if (direction === this.MOVE_LEFT) {
                if (i === 0)
                    // Already at the start of the tape, add a blank symbol at start
                    input_arr.unshift(this.BLANK);
                else
                    // Move one position to the left
                    i--;
            }
            else {
                // Move right
                if (i === input_arr.length - 1)
                    // Already at the end of the tape, append a blank symbol
                    input_arr.push(this.BLANK);
                // Move one position to the right
                i++;
            }
            // Move to the next state
            state_i = nextState;
        }

        // Record the last state reached
        if (!walked[state_i]) walked[state_i] = {};

        // Record result
        let result = (this.acceptedStates.has(state_i)) ? "Accepted" : "Rejected";
        result += "\nPATH WALKED:\n" + path;
        result += "\nTAPE:\n" + input_arr.join(separator);

        // Update graph
        const newGraph = this.getGraphData();
        newGraph.nodeDataArray.forEach(node => {
            if (walked[node.key]) node.color = Colors.walked;
        });
        newGraph.linkDataArray.forEach(link => {
            if (walked[link.from] && walked[link.from][link.label] === link.to)
                link.color = Colors.walked;
        });

        return {newGraph, result};
    }
}
