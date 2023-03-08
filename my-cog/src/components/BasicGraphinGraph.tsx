import React from 'react';
import Graphin, { Behaviors, GraphinData } from '@antv/graphin';

// a component that creates and renders a graphin graph
// it creates its data
// there is a button that changes the data
// the graph is rendered in the div with id="mountNode"
const BasicGraphinGraph = () => {
    const createGraphData = () => {
        const nodes = [
            {
                id: 'node1',
                label: 'Node 1',
                x: 600,
                y: 500,
            },
            {
                id: 'node2',
                label: 'Node 2',
                x: 100,
                y: 100,
            },
            {
                id: 'node3',
                label: 'Node 3',
                x: 300,
                y: 300,
            },
        ];
        const edges = [
            {
                source: 'node1',
                target: 'node2',
            },
            {
                source: 'node2',
                target: 'node3',
            },
        ];
        return { nodes, edges };
    }
    const [state, setState] = React.useState<GraphinData>(createGraphData());


    // a function that adds a node to the graph after the button is clicked
    const addNode = () => {
        const expandData = {
            nodes: [
                {
                    id: 'node4',
                    label: 'Node 4',
                    x: 300,
                    y: 300,
                },
            ],
            edges: [
                {
                    source: 'node3',
                    target: 'node4',
                },
            ],
        };

        setState({
            // 还需要对Node和Edge去重，这里暂不考虑
            nodes: [...state.nodes, ...expandData.nodes],
            edges: [...state.edges, ...expandData.edges],

        });
    }

    createGraphData();
    const data = { state };
    return (
        <>
            <div id="mountNode"></div>
            <button onClick={() => {
                addNode();
            }}>Change Data</button>
            <Graphin data={state}>
            </Graphin>
        </>
    );
}


export default BasicGraphinGraph;