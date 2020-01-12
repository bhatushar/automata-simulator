import React, { Component } from 'react';
import { AutomataAPI, AutomataType, GraphData } from "./Interfaces";
import Navbar from "./ui/Navbar";
import Sidebar from "./ui/Sidebar";
import Canvas from "./ui/Canvas";

interface AppState {
    /**
     * Informs other components of the type of automata being used.
     */
    automataType: AutomataType,
    /**
     * The actual automata model which will define the transition diagram and run the input.
     * It is initialized only after user submits the modelInitializer form in Sidebar component.
     */
    automata: AutomataAPI | undefined,
    /**
     * Contains the data which will be sent to the Canvas component. Canvas will draw the graph based on this data.
     * It is kept in the state object because I want the actual graph to update every time this object is changed.
     */
    graphData: GraphData,
    /**
     * Contains the output of the automata when it's run on an input tape.
     */
    result: string
}

/**
 * Initial/Default property for the state attribute.
 */
const defaultState: AppState = {
    automataType: "DFA",
    automata: undefined,
    graphData: { nodeDataArray: [], linkDataArray: [] },
    result: ""
};

/**
 * Top most component
 *
 * @state AppState
 */
class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = defaultState;
    }

    render() {
        return (
            <React.Fragment>
                <Navbar onAutomataChange={ this.handleAutomataChange }
                        activeAutomata={ this.state.automataType } />
                <Sidebar automataType={ this.state.automataType }
                    onAutomataBuild={ this.handleAutomataBuild }
                    onAutomataRun={ this.handleAutomataRun }
                    automataResult={ this.state.result } />
                <Canvas graphData={ this.state.graphData } />
            </React.Fragment>
        );
    }

    /**
     * Invoked when the user changes the automata from the navbar.
     * The method updates App's state with the new automata
     *
     * @param automataType
     */
    private handleAutomataChange = (automataType: AutomataType) => {
        // Reset everything
        const updatedState = defaultState;
        // Change the automata type
        updatedState.automataType = automataType;
        this.setState(updatedState);
    };

    /**
     * Invoked when user submits the modeInitializer form.
     * It updates App's state with the newly built automata and it's respective graph data.
     *
     * @param automata
     */
    private handleAutomataBuild = (automata: AutomataAPI) =>
        this.setState({ automata, graphData: automata.getGraphData() });

    /**
     * Invoked when user submits modelTest form.
     * Invokes the run method of the automata object, and updates App's state with the result.
     *
     * @param tape
     * @param separator
     */
    private handleAutomataRun = (tape: string, separator: '' | '\n') => {
        if (this.state.automata) {
            const { newGraph, result } = this.state.automata.run(tape, separator);
            this.setState({ graphData: newGraph, result });
        }
    };
}

export default App;
