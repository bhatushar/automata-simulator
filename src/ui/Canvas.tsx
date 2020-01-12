import React, { Component } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import { GraphData } from "../Interfaces";
import { Colors } from "../Colors";

// Aliasing for convenience
const $ = go.GraphObject.make;

/**
 * This class uses GoJS library to perform all graph related operations.
 * It is responsible for drawing and updating the transition diagram.
 *
 * @props { graphData: GraphData }
 */
class Canvas extends Component<{ graphData: GraphData }> {
    render() {
        return (
            <ReactDiagram initDiagram={ this.createDiagram }
                divClassName=""
                nodeDataArray={ this.props.graphData.nodeDataArray }
                linkDataArray={ this.props.graphData.linkDataArray }
                skipsDiagramUpdate={ false /* Updates the diagram every time graphData changes */ }
                onModelChange={ () => {/* Just here for formality */} } />
        );
    }

    /**
     * Creates a new diagram instance for GoJS and sets the properties for the diagram.
     *
     * @return go.Diagram
     */
    private createDiagram = (): go.Diagram => {
        // Creating a new diagram
        const diagram = $(go.Diagram,
            {
                // Zoom on scroll
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                // Setting key which will be used to find a link during automata execution
                model: $(go.GraphLinksModel, { linkKeyProperty: "key" })
            }
        );

        // Sets the initial layout of the diagram
        diagram.layout = new go.ForceDirectedLayout();
        // Disabling direct modification by user
        diagram.allowDelete = false;
        diagram.allowCopy = false;

        // Designing nodes
        diagram.nodeTemplate = $(go.Node, "Auto",
            // Node is a circle
            $(go.Shape, "Circle",
                // Setting border color, border width
                { stroke: Colors.nodeBorder, strokeWidth: 7 },
                // Custom background color for nodes
                new go.Binding("fill", "color")),
            $(go.TextBlock,
                // Every node contains a label
                { margin: 10, stroke: Colors.text, font: "16pt sans-serif" },
                // Dynamically set the label
                new go.Binding("text", "key"))
        );

        // Designing links
        diagram.linkTemplate = $(go.Link,
            // Link color and width
            $(go.Shape, { strokeWidth: 8 },
                // Dynamically set custom link color if the attribute is provided
                new go.Binding("stroke", "color")),
            // Arrowhead properties
            $(go.Shape, { toArrow: "Standard", stroke: Colors.link, scale: 2 }),
            // The link label
            $(go.Panel, "Auto",
                // Label background is same as diagram background
                $(go.Shape, "Rectangle", { fill: Colors.linkLabelBackground, stroke: null }),
                // Actual label text
                $(go.TextBlock, { margin: 5, stroke: Colors.text, font: "16pt sans-serif" },
                    // Dynamically setting label
                    new go.Binding("text", "label"))),
            // Link shape properties
            {
                curve: go.Link.Bezier, // Makes the link curve
                toShortLength: 8, // Line doesn't cover arrow
                adjusting: go.Link.Stretch, // Link persists it's shape
                reshapable: true // Allows reshaping links
            }
        );

        return diagram;
    };

}

export default Canvas;