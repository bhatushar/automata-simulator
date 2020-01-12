// This file contains a single object which is used in different modules.

/**
 * The Colors object is an immutable constant which contains the color property for different graph elements.
 *  1. state: Default background color of a state/node
 *  2. initialState: Background color for the initial state
 *  3. acceptedState: Background color for the accepted/final states
 *  4. nodeBorder: Border/stroke color of a node
 *  5. link: Default color of a link between two nodes
 *  6. linkLabelBackground: Background color for the label on a link, it is set to be same as the document background
 *  7. text: Color for any text in the graph
 *  8. walked: This is attributes to nodes and links which were accessed while running the automata
 */
export const Colors = Object.freeze({
  "state": "#a83420",
  "initialState": "#380000",
  "acceptedState": "#076e00",
  "nodeBorder": "#2d92ba",
  "link": "#D3D3D3",
  "linkLabelBackground": "#20201F",
  "text": "#ffffff",
  "walked": "#1d53ff",
});