import { INode, NodeConfig } from '@antv/g6';
import Graphin, { Behaviors, GraphinContext, GraphinData, IG6GraphEvent } from '@antv/graphin';
import React, { useContext, useEffect } from 'react';
import { GlobalDataContext, IElectrodeFocusContext } from '../contexts/ElectrodeFocusContext';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';
import { getGraphBase, updateGraphCoherence } from '../shared/GraphService';
import { getSingletonDuration, getSingletonFreqList } from '../shared/RequestsService';




const SampleBehavior = () => {
    const { graph, apis } = useContext(GraphinContext);
    const { electrode, setElectrode } = useContext(GlobalDataContext) as IElectrodeFocusContext;

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
    const { electrode, setElectrodeList, freqRange, setFreqRange, freqList, setFreqList, timeRange, setTimeRange, duration, setDuration } = useContext(GlobalDataContext) as IElectrodeFocusContext;
    const { options, settings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
    const minRef = React.useRef<HTMLInputElement>(null);
    const maxRef = React.useRef<HTMLInputElement>(null);
    const timeRef = React.useRef<HTMLSelectElement>(null);


    const getFrequencyAndTime = async () => {
        let frequencyListAsync = await getSingletonFreqList();
        let durationAsync = await getSingletonDuration();
        return { frequencyListAsync, durationAsync };
    }

    const createGraphData = async () => {
        // create the nodes and edges using GraphService module
        let graph: GraphinData = { nodes: [{ id: "1" }], edges: [] };
        // call getGraphBase to get the base graph data
        graph = await getGraphBase();
        graph = await updateGraphCoherence(graph, freqRange, timeRange);
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

        //console.log(`graph:`, graph);
        return { ...graph };
    }
    const [state, setState] = React.useState<GraphinData>({ nodes: [{ id: "1" }], edges: [] });

    // change the graph data according to the user's selections
    useEffect(() => {
        getFrequencyAndTime().then(({ frequencyListAsync, durationAsync }) => {
            setFreqList(frequencyListAsync);
            setDuration(durationAsync);
        }).then(() => {
            createGraphData().then((data) => {
                //console.log(`data:`, data);
                setState(data);
            });
        });
    }, [freqRange, timeRange, options, settings]);

    createGraphData();
    // set the electrode list according to the current graph
    useEffect(() => {
        setElectrodeList(state.nodes.map((node) => node.id));
    }, [state]);
    const data = state;
    return (
        <>
            <div id="mountNode">
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