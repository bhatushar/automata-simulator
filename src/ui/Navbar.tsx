import React, { Component } from "react";
import "./css/navbar.css";
import { AutomataType } from "../Interfaces";

interface NavbarProps {
    /**
     * This method is called when user changes the automata from the navbar.
     *
     * @param automataType Automata which the user clicked on
     */
    onAutomataChange: (automataType: AutomataType) => void;
    /**
     * Keeps track of which automata is currently running.
     */
    activeAutomata: AutomataType
}

/**
 * It contains the list of automaton and can be used to switch between them.
 *
 * @props NavbarProps
 */
class Navbar extends Component<NavbarProps> {
    private automata: AutomataType[] = ["DFA", "NFA", "Turing Machine"];

    render() {
        return (
            <nav className="navbar">
                {/* Navbar title */}
                <a href="/" className="navbar-brand">Automata Simulator</a>
                <div className="navbar-list">
                    { this.automata.map(automata =>
                        <button key={ automata }
                            className={ (this.props.activeAutomata === automata) ? "navbar-item active" : "navbar-item"}
                            onClick={ () => { this.changeAutomata(automata) } }>
                            { automata }
                        </button>
                    ) }
                </div>
                
                <div id="github">
                    <a href="https://github.com/bhatushar/automata-simulator"
                        className="navbar-item">
                        GitHub Repository
                    </a>
                </div>
            </nav>
        );
    }

    private changeAutomata = (key: AutomataType) =>
        this.props.onAutomataChange(key);
}

export default Navbar;
