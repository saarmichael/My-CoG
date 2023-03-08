import React from 'react';
import Graphin, { Behaviors, GraphinData } from '@antv/graphin';
import { changeEdgeWidthGraphin, getAverageGraphinData, getFrequencyList, getGraphinData } from '../shared/GraphService';

// a component that creates and renders a graphin graph
// it creates its data
// there is a button that changes the data
// the graph is rendered in the div with id="mountNode"
const BasicGraphinGraph = () => {
    const createGraphData = () => {
        // create the nodes and edges using GraphService module
        let { nodes, edges }: GraphinData = getGraphinData(0);
        edges = changeEdgeWidthGraphin(edges, 1, 30);
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
            edges = changeEdgeWidthGraphin(edges, 1, 30);
            setState({ nodes, edges });
        }}>
            {freqs.map((freq, index) => {
                return <option key={index} value={freq}>{freq}</option>
            })}
        </select>

    );

    // two input fields: min and max.
    // the user can enter a min and max value for the frequency range
    // the graph then updates accordingly
    // listen to the onChange event of the input fields and update the state accordingly
    // cerate a ref to the input fields and use the ref to get the values of the input fields

    // refs
    const minRef = React.useRef<HTMLInputElement>(null);
    const maxRef = React.useRef<HTMLInputElement>(null);

    const minMaxUpdate = () => {
        // validity check: check if the input fields are not empty
        if (minRef.current && maxRef.current) {
            if (minRef.current?.value == "" || maxRef.current?.value == "") {
                // if the min input field is empty, then min = 0
                if (minRef.current?.value == "") {
                    minRef.current.value = "0";
                }
                // if the max input field is empty, then max = max(freqs)
                if (maxRef.current?.value == "") {
                    maxRef.current.value = freqs[freqs.length - 1].toString();
                }
                
            } 
            // get the values of the input fields
            let min = parseFloat(minRef.current.value);
            let max = parseFloat(maxRef.current.value);
            // if min is greater than max, then max = min
            if (min > max) {
                maxRef.current.value = min.toString();
            }
            // if min is less than 0, then min = 0
            if (min < 0) {
                minRef.current.value = "0";
            }
            if(min > freqs[freqs.length - 1]) {
                minRef.current.value = "0";
            }
            let { nodes, edges }: GraphinData =
                getAverageGraphinData(parseFloat(minRef.current.value), parseFloat(maxRef.current.value));
            edges = changeEdgeWidthGraphin(edges, 1, 50);
            setState({ nodes, edges });
        }
        // update the edges width of the current frequency range
    }

    // create the html for the input fields with a submit button
    const minMaxInput = (
        <div>
            <input type="number" ref={minRef} />
            <input type="number" ref={maxRef} />
            <button onClick={minMaxUpdate}>Submit</button>
        </div>
    );


    createGraphData();
    const data = state;
    return (
        <>
            <div id="mountNode"></div>
            {freqDropdown}
            {minMaxInput}
            <Graphin data={data} layout={{ type: 'circular' }}>
            </Graphin>
        </>
    );
}


export default BasicGraphinGraph;