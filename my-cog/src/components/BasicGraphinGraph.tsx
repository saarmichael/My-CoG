import React from 'react';
import Graphin, { Behaviors, GraphinData } from '@antv/graphin';
import { getGraphData, getGraphinData } from '../shared/GraphService';

// a component that creates and renders a graphin graph
// it creates its data
// there is a button that changes the data
// the graph is rendered in the div with id="mountNode"
const BasicGraphinGraph = () => {
    const createGraphData = () => {
        // create the nodes and edges using GraphService module
        let {nodes, edges} : GraphinData = getGraphinData(0);
        return { nodes, edges };
    }
    const [state, setState] = React.useState<GraphinData>(createGraphData());


    // a function that adds a node to the graph after the button is clicked
    const addNode = () => {
        const expandData = {
            nodes: [
                {
                    id: 'node3',
                    x: 300,
                    y: 300,
                },
            ],
            edges: [
                {
                    source: 'node2',
                    target: 'node3',
                },
            ],
        };

        setState({
            nodes: [...state.nodes, ...expandData.nodes],
            edges: [...state.edges, ...expandData.edges],

        });
    }

    createGraphData();
    const data = state ;
    return (
        <>
            <div id="mountNode"></div>
            <button onClick={() => {
                addNode();
            }}>Change Data</button>
            <Graphin data={data}>
            </Graphin>
        </>
    );
}


export default BasicGraphinGraph;