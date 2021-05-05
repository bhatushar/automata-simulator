import { AutomataAPI, AutomataData, GraphData } from "../Interfaces";
import { Colors } from "../Colors";
import { Automata } from "./Automata";

/**
 * Transition function: T(currentState, input) = nextState.
 * The object can be accessed as: T["currentState"]["input"] = "nextState"
 */
interface DFATransition {
    [state: string]: { [input: string]: string }
}

/**
 * Deterministic Finite Automata
 * Formal definition: M = (Q, E, t, q, F)
 * where, Q is a finite set of states
 *        E is a finite set of input alphabet
 *        t is a transition function
 *        q is the initial state
 *        F is a subset of Q, a set of accepted states
 * t: (Q x E) -> Q
 */
export class DFA extends Automata implements AutomataAPI {
    private readonly transitions: DFATransition;

    public constructor(data: AutomataData) {
        super(data);

        // Regex to parse a transition; format: currentState, input = nextState
        // The whitespaces are ignored
        const transition_re = /^\s*([a-zA-Z0-9]+)\s*,\s*([a-zA-Z0-9]+)\s*=\s*([a-zA-Z0-9]+)\s*$/;

        this.transitions = {};
        // Initializing transitions with the list of states
        this.states.forEach(q => this.transitions[q] = {});
        data.transitions.split('\n').forEach((t_str: string) => {
            // Iterating over individual transitions
            const matches = t_str.match(transition_re);
            if (matches) {
                // Assigning respective matches
                const currentState = matches[1], input = matches[2], nextState = matches[3];
                if(this.states.has(currentState) && this.states.has(nextState))
                    // Create a transition is the two states are defined
                    this.transitions[currentState][input] = nextState;
            }
        });
    }

    public getGraphData(): GraphData {
        const graphData = super.getGraphData();
        // Loop over every T[q][i] transition
        for (let q in this.transitions)
            for (let i in this.transitions[q])
                // Add link
                graphData.linkDataArray.push({
                    from: q,
                    to: this.transitions[q][i],
                    label: i,
                    key: `(${q},${i})`, // (q,i)
                    color: Colors.link
                });
        return graphData;
    }

    /**
     * DFA works by reading an input, checking if a transition exists for the said input from the current state, and
     * making the transition is it exists.
     * Every (q, i) pair has a unique transition.
     *
     * @param input
     * @param separator
     * @return { newGraph: GraphData, result: string }
     */
    public run(input: string, separator: '' | '\n'): { newGraph: GraphData, result: string } {
        const input_arr = input.split(separator);
        // Contains all the transitions made by DFA
        const walked: DFATransition = {};
        // Contains the ordered path walked by DFA
        let path: string = "";
        // state iterator; contains the name of the current state
        let state_i = this.initialState;
        let result: "Accepted" | "Rejected" | undefined;

        for (let index = 0; index < input_arr.length; index++) {
            const i = input_arr[index];
            // Define for every state visited
            if (!walked[state_i]) walked[state_i] = {};
            // If transition exists for given input
            if (this.transitions[state_i][i]) {
                walked[state_i][i] = this.transitions[state_i][i];
                path += `(${state_i}, ${i}) = ${walked[state_i][i]}\n`;
                // Move to next state
                state_i = walked[state_i][i];
            }
            else {
                // No further transitions
                result = "Rejected";
                break;
            }
        }

        if (result === undefined) {
            // All input symbols were read and processed
            // Input is accepted if last state is an accepted state
            result = this.acceptedStates.has(state_i) ? "Accepted" : "Rejected";
        }
        result += "\n\nPATH WALKED:\n" + path;

        // Update graph to indicate the transitions made
        const newGraph: GraphData = this.getGraphData();
        newGraph.nodeDataArray.forEach(node => {
            if (walked[node.key]) node.color = Colors.walked;
        });
        newGraph.linkDataArray.forEach(link => {
            if (walked[link.from] && walked[link.from][link.label] === link.to)
                link.color = Colors.walked;
        });

        return { newGraph, result };
    }
}
