import React, { useContext, useEffect } from 'react';
import Graphin, { Behaviors, GraphinContext, GraphinData, IG6GraphEvent } from '@antv/graphin';
import { changeEdgeWidthGraphin, colorCodeEdges, FreqRange, getAverageGraphinData, getFrequencyList, getGraphBase, getTimeIntervals, thresholdGraph, updateGraphCoherence } from '../shared/GraphService';
import { ElectrodeFocusContext, IElectrodeFocusContext } from '../contexts/ElectrodeFocusContext';
import { INode, NodeConfig } from '@antv/g6';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';
import { Checkbox } from '@mui/material';
import { apiGET } from '../shared/ServerRequests';
import { BasicGraphResponse, TimeInterval } from '../shared/requests';



const SampleBehavior = () => {
    const { graph, apis } = useContext(GraphinContext);
    const { electrode, setElectrode } = useContext(ElectrodeFocusContext) as IElectrodeFocusContext;

    useEffect(() => {

        graph.changeSize(580, 560);
        // 初始化聚焦到`node-1`
        const handleClick = (evt: IG6GraphEvent) => {
            const node = evt.item as INode;
            const model = node.getModel() as NodeConfig;
            // set the context
            setElectrode(model.id);
        };
        // 每次点击聚焦到点击节点上
        graph.on('node:click', handleClick);
        return () => {
            graph.off('node:click', handleClick);
        };
    }, []);

    useEffect(() => {
        // change the selected node on the graph when the context changes
        const node = graph.findById(electrode) as INode;
        if (node) {
            // deselect all nodes
            graph.findAllByState('node', 'selected').forEach((n) => {
                graph.setItemState(n, 'selected', false);
            });
            graph.setItemState(node, 'selected', true);
            // "click" the selected node
            graph.emit('node:click', { item: node });

        }
    }, [electrode]);
    return null;
};

// a component that creates and renders a graphin graph
// it creates its data
// there is a button that changes the data
// the graph is rendered in the div with id="mountNode"
const BasicGraphinGraph = () => {

    const { ActivateRelations, ZoomCanvas, DragCanvas, FitView } = Behaviors;
    const { electrode, setElectrodeList } = useContext(ElectrodeFocusContext) as IElectrodeFocusContext;
    const { options, settings, generalOptions, setGeneralOptions } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
    const minRef = React.useRef<HTMLInputElement>(null);
    const maxRef = React.useRef<HTMLInputElement>(null);
    const timeRef = React.useRef<HTMLSelectElement>(null);
    const [freqRange, setFreqRange] = React.useState<FreqRange>({ min: 0, max: 0 });

    const createGraphData = async () => {
        // create the nodes and edges using GraphService module
        let graph: GraphinData = { nodes: [{ id: "1" }], edges: [] };
        let time: TimeInterval | undefined = undefined;
        let option = generalOptions.find(option => option.label === "time windows");
        if (option) {
            if (option.checked && option.value) {
                time = { start: parseFloat(option.value), end: parseFloat(option.value) + 20 };
            }
        }
        // call getGraphBase to get the base graph data
        graph = await getGraphBase();

        graph = await updateGraphCoherence(graph, freqRange, time);
        graph = options.reduce((acc, option) => {
            if (option.checked) {
                return option.onChange(acc, settings);
            } else {
                if (option.defaultBehavior) {
                    return option.defaultBehavior(acc, settings);
                }
            }
            return acc;
        }, graph);

        console.log(`graph:`, graph);
        return {...graph};
    }
    const [state, setState] = React.useState<GraphinData>({ nodes: [{ id: "1" }], edges: [] });
    
    // change the graph data according to the user's selections
    useEffect(() => {
        createGraphData().then((data) => {
            console.log(`data:`, data);
            setState(data);
        });
    }, [freqRange, options, settings, generalOptions]);

    const freqs: number[] = getFrequencyList();
    // create a dropdown menu that consists of the frequencies and the user can select one
    // when the user selects a frequency, the graph is updated accordingly
    // make sure each child has a unique key
    const freqDropdown = (
        <select onChange={(e) => {
            const freq = parseFloat(e.target.value);
            setFreqRange({ min: freq, max: freq });
        }}>
            {freqs.map((freq, index) => {
                return <option key={index} value={freq.toFixed(2)}>{freq.toFixed(2)}</option>
            })}
        </select>
    );

    const times: number[] = getTimeIntervals();
    const timesDropdown = (
        <>
            <label>Time: </label>
            <select
                ref={timeRef}
                onChange={async (e) => {
                    setGeneralOptions(generalOptions.map(option => {
                        if (option.label === "time windows") {
                            // return the option with the new value
                            return { ...option, checked: true, value: e.target.value };
                        }
                        return option;
                    }));
                    const url = 'http://localhost:5000/time?start=' + parseFloat(e.target.value) + '&end=' + (parseFloat(e.target.value) + 20);
                    try {
                        const response = await fetch(url);
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.text();
                        console.log(data);
                        } catch (error) {
                        console.error(error);
                        }
                }}>
                {times.map((time, index) => {
                    return <option key={index} value={time.toFixed(2)}>{time.toFixed(2)}</option>
                })}
            </select>
            &nbsp;&nbsp;&nbsp;&nbsp;
        </>
    );

    // two input fields: min and max.
    // the user can enter a min and max value for the frequency range
    // the graph then updates accordingly
    // listen to the onChange event of the input fields and update the state accordingly
    // cerate a ref to the input fields and use the ref to get the values of the input fields
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
            if (min > freqs[freqs.length - 1]) {
                minRef.current.value = "0";
            }
            setFreqRange({ min: min, max: max });
        }
        // update the edges width of the current frequency range
    }

    // create the html for the input fields with a submit button
    const minMaxInput = (
        <div>
            Min: <input type="number" ref={minRef} /> &nbsp;
            Max: <input type="number" ref={maxRef} />
            <button onClick={minMaxUpdate}>Submit</button>
        </div>
    );


    createGraphData();
    // set the electrode list according to the current graph
    useEffect(() => {
        setElectrodeList(state.nodes.map((node) => node.id));
    }, [state]);
    const data = state;
    return (
        <>
            <div id="mountNode">
                <Checkbox onChange={(e) => {
                    // set the general options with the label "time windows" to be the opposite of the current value
                    let isChecked = generalOptions.find((option) => option.label == "time windows")?.checked;
                    setGeneralOptions(generalOptions.map((option) => {
                        if (option.label == "time windows") {
                            return { ...option, checked: !isChecked }
                        }
                        return option;
                    }));
                }}
                    checked={generalOptions.find((option) => option.label == "time windows")?.checked}
                    value={"time windows"}
                />

                {generalOptions.find((option) => option.label == "time windows")?.checked ? timesDropdown : null}
                Frequency: {freqDropdown}
                {minMaxInput}
                <Graphin data={data} layout={{ type: 'circular', center: [275, 300] }} style={{ width: "75%" }}>
                    <ActivateRelations trigger="click" />
                    <SampleBehavior />
                    <ZoomCanvas disabled={true} />
                    <DragCanvas disabled={true} />
                </Graphin>
            </div>
        </>
    );
}


export default BasicGraphinGraph;