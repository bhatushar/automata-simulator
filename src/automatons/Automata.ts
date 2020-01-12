import {GraphData} from "../Interfaces";
import {Colors} from "../Colors";

/**
 * It is a parent class for different automaton. It should not be instantiated.
 * It is extended by different automata classes, and provides common attributes.
 */
export class Automata {
    /**
     * It is the state from which the automata starts its processing.
     */
    protected readonly initialState: string;
    /**
     * A set of all the states of the automata.
     * Using a set for faster access during automata execution.
     */
    protected readonly states: Set<string>;
    /**
     * Set of all accepted states of the automata. It's a subset of states set.
     * Using a set for faster access during automata execution.
     */
    protected readonly acceptedStates: Set<string>;

    /**
     * Initializes states, acceptedStates and initialState values.
     *
     * @param data It is a subset of AutomataData interface
     */
    constructor(data: { states: string, acceptedStates: string }) {
        // States are alphanumeric
        const state_re = /^[a-zA-Z0-9]+$/;
        // Create an array of states which pass the regex test
        const statesArray = data.states.split('\n').filter(q => state_re.test(q));
        // First state in the list is the initial state
        this.initialState = statesArray[0];
        // Extracting list of states and storing unique states
        this.states = new Set<string>(statesArray);
        // Extracting accepted states, only keep those ones which are present in "states" set.
        this.acceptedStates = new Set<string>(data.acceptedStates
            .split('\n')
            .filter(q => this.states.has(q)));
    }

    /**
     * Creates a GraphData object which will be used by Canvas module to  create the respective transition diagram.
     * Only initializes the graph nodes with the states. Since this is common for all automaton, it is implemented here.
     * The initialization of graph links depends on the transition function and, thus, is left up to individual automata.
     * TODO avoid repeated evaluation because the same data is returned every time (same for children methods)
     *
     * @return GraphData Graph initialized with the nodes
     */
    protected getGraphData(): GraphData {
        const graphData: GraphData = { nodeDataArray: [], linkDataArray: [] };

        this.states.forEach(q => {
            const node = { key: q, color: Colors.state };
            // Set appropriate color
            if (q === this.initialState) node.color = Colors.initialState;
            // Priority given to accepted state color
            if (this.acceptedStates.has(q)) node.color = Colors.acceptedState;
            graphData.nodeDataArray.push(node);
        });

        return graphData;
    }
}