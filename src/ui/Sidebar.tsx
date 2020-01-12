import React, { Component, FormEvent } from "react";
import {AutomataAPI, AutomataType} from "../Interfaces";
import { DFA } from "../automatons/DFA";
import { NFA } from "../automatons/NFA";
// import {PDA} from "../automatons/PDA";
import {TuringMachine} from "../automatons/TuringMachine";
import "./css/sidebar.css";

interface SidebarState {
    /**
     * Contains all the data attributes which are passed to the automata.
     */
    automataData: {
        /**
         * Automata states, separated by new-line '\n'.
         */
        states: string,
        /**
         * Accepted states, separated by new-line '\n'.
         * These states should also be present in "states" string.
         */
        acceptedStates: string,
        /**
         * Transitions that can be made by the automata, separated by new-line '\n'.
         */
        transitions: string,
        /**
         * Input tape, separation depends on tapeTag.
         */
        tape: string
    },
    /**
     * The type of component used to accept tape input from the user.
     * input: Each character is an individual input to the automata.
     * textarea: Each line is an individual input to the automata.
     */
    tapeTag: "input" | "textarea"
}

interface SidebarProps {
    /**
     * Currently active automata.
     * Sidebar uses it to select which class instance is needed to build the automata.
     */
    automataType: AutomataType,
    /**
     * It will be invoked every time the user builds a new automata.
     * That is, it'll be invoked on "modelInitializer form" submission.
     *
     * @param AutomataAPI
     */
    onAutomataBuild: (automata: AutomataAPI) => void,
    /**
     * Invoked on "modelTest form" submission.
     * It is responsible for testing the tape on the automata.
     *
     * @param tape Input tape
     * @param separator Character on which to split the tape
     */
    onAutomataRun: (tape: string, separator: '' | '\n') => void,
    /**
     * Contains the output of the automata from the last run.
     */
    automataResult: string
}

/**
 * Contains forms for building automata and testing input. Also displays the result of test.
 *
 * @props SidebarProps
 * @state SidebarState
 */
class Sidebar extends Component<SidebarProps, SidebarState> {
    constructor(props: SidebarProps) {
        super(props);
        // Initializing here because it is used inside render method
        this.state = {
            automataData: {
                states: "",
                acceptedStates: "",
                transitions: "",
                tape: ""
            },
            tapeTag: "input"
        };
    }

    render() {
        // Deconstructing for convenience
        const { states, acceptedStates, transitions, tape } = this.state.automataData;
        // React converts CamelCase variables into Components for some reason
        const TapeTag = this.state.tapeTag;
        return (
            <div className="sidebar">
                {/* This form provides input parameters which are used to build the automata */}
                <form id="modelInitializer" onSubmit={this.buildAutomata}>
                    <h1>Create model</h1>
                    {/* List of automata states
                        Each state is entered in a new line
                        The first state will be the initial state
                        */}
                    <label htmlFor="states">States</label>
                    <textarea id="states"
                              value={ states }
                              placeholder="States should be alphanumeric (without whitespaces).
                                    Only enter one state per line. The first state will be the initial state."
                              onChange={ this.handleStatesChange }/>
                    {/* List of accepted states
                        Each state is entered in a new line
                        Accepted states must be a subset of transition states
                        */}
                    <label htmlFor="acceptedStates">Accepted States</label>
                    <textarea id="acceptedStates"
                              value={ acceptedStates }
                              placeholder="Only enter one state per line.
                                    These states should also be mentioned in 'States' input."
                              onChange={ this.handleAcceptedStatesChange }/>
                    {/* Transition function
                        Spaces are not stored
                        Transition rules are split by new line
                        */}
                    <label htmlFor="transition">Transition Function</label>
                    <textarea id="transition"
                              value={ transitions }
                              placeholder={ this.getTransitionFormat() }
                              onChange={ this.handleTransitionsChange }/>
                    {/* Submit button */}
                    <input type="submit" id="buildBtn" className="btn-primary" value="Build"/>
                </form>

                {/* This form provides tape input to the automata for processing */}
                <form id="modelTest" onSubmit={ this.runAutomata }>
                    <h1>Test model</h1>
                    {/* Tape input
                        If it's read using input, each character will be processed independently
                        If it's read using textarea, each line will be processed independently
                        */}
                    <label htmlFor="tape">Tape input</label>
                    <TapeTag type="text"
                             id="tape"
                             value={ tape }
                             onChange={ this.handleTapeChange }/>
                    {/* Button toggles tape between input and textarea */}
                    <button id="tapeToggle" className="btn-alt" onClick={ this.toggleTape }>
                        Switch to { (this.state.tapeTag === "input")? "string": "character"} input
                    </button>
                    {/* Tests the tape */}
                    <input type="submit" id="runBtn" className="btn-primary" value="Test" />

                    {/*<button title="Stop automata mid-execution. Trying to figure it out."
                            id="resetBtn" className="btn-secondary"
                            onClick={ this.resetAutomata }
                            disabled={ true }>
                        Reset
                    </button>*/}
                </form>

                {/* Only show this segment if a result if returned by the automata */}
                { this.props.automataResult &&
                    <section id="automataResult">
                        <h2>Result</h2>
                        <div id="resultContainer">{
                            // Split result on new-line
                            this.props.automataResult.split('\n').map((i: string, key) => {
                                return <React.Fragment key={key}>{i} <br/></React.Fragment>;
                            })
                        }</div>
                    </section>
                }
            </div>
        );
    }

    /**
     * Creates a new instance of an automata and passes it to the parent.
     */
    private buildAutomata = (event: FormEvent) => {
        event.preventDefault();
        // Extracting automata related information from state
        const { automataData: data } = this.state;
        // Selecting the automata instance and typecasting the data accordingly
        switch (this.props.automataType) {
            case "NFA":
                this.props.onAutomataBuild(new NFA(data));
                break;
            case "PDA":
                //this.props.onAutomataBuild(new PDA(data));
                break;
            case "Turing Machine":
                this.props.onAutomataBuild(new TuringMachine(data));
                break;
            default:
                this.props.onAutomataBuild(new DFA(data));
                break;
        }
    };

    /**
     * Collects the tape input given by user and passes it forward to be processed by the automata.
     *
     * @param event
     */
    private runAutomata = (event: FormEvent) => {
        event.preventDefault();
        const separator = (this.state.tapeTag === "input") ? '' : '\n';
        this.props.onAutomataRun(this.state.automataData.tape, separator);
    };

    /**
     * Returns the format in which the automata expects the transitions to be.
     *
     * @return string
     */
    private getTransitionFormat = (): string => {
        let format: string = "";
        switch (this.props.automataType) {
            case "DFA":
                format = "Current-state, Input = Next-state";
                break;
            case "NFA":
                format = "Current-state, Input = Next-state [, Next-state ...]\n\nUse 'null' for null-transitions.";
                break;
            case "PDA":
                //format = "Current-state, Input, Stack-top = (Next-state, Stack-replace) " +
                //    "[, (Next-state, Stack-replace) ...]\nZ is the stack start symbol.";
                break;
            case "Turing Machine":
                format = "Current-state, Input = Next-state, Tape-replace, L/R\n\nUse B for blank symbol.";
                break;
        }
        return format;
    };

    /**
     * Toggles the component which accepts tape input from the user.
     *
     * @param event
     */
    private toggleTape = (event: FormEvent) => {
        event.preventDefault();
        const tag = (this.state.tapeTag === "input") ? "textarea" : "input";
        this.setState({ tapeTag: tag });
    };

    // TODO decide what to do with this
    // private resetAutomata = (event: FormEvent) => { event.preventDefault(); };

    /* Following are just a bunch of onChange listeners for input and textarea components.
       It's really annoying that I can't just collect the form data at the time of submission.
       Instead, I have to manage individual listener, even though they all perform almost similar tasks.
       They just update the state object with the new value.
       This is the "recommended" way as per the official docs.
     */
    private handleStatesChange = (event: FormEvent<HTMLTextAreaElement>) => {
        const automataData = this.state.automataData;
        automataData.states = event.currentTarget.value;
        this.setState({ automataData });
    };

    private handleAcceptedStatesChange = (event: FormEvent<HTMLTextAreaElement>) => {
        const automataData = this.state.automataData;
        automataData.acceptedStates = event.currentTarget.value;
        this.setState({ automataData });
    };

    private handleTransitionsChange = (event: FormEvent<HTMLTextAreaElement>) => {
        const automataData = this.state.automataData;
        automataData.transitions = event.currentTarget.value;
        this.setState({ automataData });
    };

    private handleTapeChange = (event: FormEvent<HTMLTextAreaElement> | FormEvent<HTMLInputElement>) => {
        const automataData = this.state.automataData;
        automataData.tape = event.currentTarget.value;
        this.setState({ automataData });
    };
}


export default Sidebar;