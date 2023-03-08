import React from 'react';
import Graphin, { Behaviors, GraphinData } from '@antv/graphin';
import { changeEdgeWidthGraphin, getFrequencyList, getGraphinData } from '../shared/GraphService';

// a component that creates and renders a graphin graph
// it creates its data
// there is a button that changes the data
// the graph is rendered in the div with id="mountNode"
const BasicGraphinGraph = () => {
    const createGraphData = () => {
        // create the nodes and edges using GraphService module
        let { nodes, edges }: GraphinData = getGraphinData(0);
        edges = changeEdgeWidthGraphin(4, edges, 1, 30);
        return { nodes, edges };
    }
    const [state, setState] = React.useState<GraphinData>(createGraphData());

    const freqs: number[] = getFrequencyList();
    // create a dropdown menu that consists of the frequencies and the user can select one
    // when the user selects a frequency, the graph is updated accordingly
    // make sure each child has a unique key
    const freqDropdown = (
        <select onChange={(e) => {
            const freq = parseFloat(e.target.value);
            let { nodes, edges }: GraphinData = getGraphinData(freq);
            edges = changeEdgeWidthGraphin(4, edges, 1, 30);
            setState({ nodes, edges });
        }}>
            {freqs.map((freq, index) => {
                return <option key={index} value={freq}>{freq}</option>
            })}
        </select>

    );

    createGraphData();
    const data = state;
    return (
        <>
            <div id="mountNode"></div>
            {freqDropdown}
            <Graphin data={data} layout={{ type: 'circular' }}>
            </Graphin>
        </>
    );
}


export default BasicGraphinGraph;