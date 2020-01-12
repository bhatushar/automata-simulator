// This file contains a list of interfaces used across the application

/**
 * The data used by Canvas component to initialize the diagram.
 *
 * linkDataArray describes 'from' which state 'to' which state a transition occurs. The label is just the text that
 * appears on the transition (it depends on the automata). Each link must also have a unique key.
 */
export interface GraphData {
    /**
     * Each item in nodeDataArray array consists of a key  which is the name of the state, and background color for
     * that node. The color is based on the type of node - initial, accepted, walked, default.
     */
    nodeDataArray: { key: string, color: string }[],
    /**
     * Each link has a "from" and "to" node (identified by the key), a label, a key which is used to uniquely identify
     * the link and a color. The color can either be of default link or walked link.
     */
    linkDataArray: { from: string, to: string, label: string, key: string, color: string }[]
}

/**
 * A collection of minimal data attributes which are required by every automata.
 * In each string, '\n' acts as the separator.
 */
export interface AutomataData {
    /**
     * A string of all states. States should be alphanumeric.
     */
    states: string,
    /**
     * A string of all accepted/final states. Accepted states should also be present in states.
     */
    acceptedStates: string,
    /**
     * A string of all transitions and each transition should follow the format specific to the automata.
     */
    transitions: string
}

/**
 * Defines a collection of properties which must be implemented by every automata.
 * These properties are used by the application to interact with the automata.
 */
export interface AutomataAPI {
    /**
     * Method returns a GraphData object containing information about the nodes and links in the diagram drawn by
     * Canvas.
     * This data may be generated only once and accessed on each run of the automata. It remains unchanged throughout
     * the automata's lifecycle and may also be used to reset the diagram to initial state after a run.
     *
     * @return GraphData
     */
    getGraphData: () => GraphData
    /**
     * This method contains the actual process for execution of the automata. It describes how the automata behaves for
     * a given input.
     * Method returns an object containing updated GraphData and a result.
     * The original graph data should not be modified as it is needed for reset purposes. The data is modified such that
     * the nodes and links which were walked should have a different color.
     * The result is just a string which is displayed in the sidebar as an "output" of the automata.
     *
     * @param input String of tape input
     * @param separator A single character used to separate individual input in the tape
     * @return { newGraph: GraphData, result: string }
     */
    run: (input: string, separator: '' | '\n') => { newGraph: GraphData, result: string }
}

/**
 * List of valid automatons
 */
export type AutomataType = "DFA" | "NFA" | "PDA" | "Turing Machine";
