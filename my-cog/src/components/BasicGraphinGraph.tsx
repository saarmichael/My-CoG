import { INode, NodeConfig } from '@antv/g6';
import Graphin, { Behaviors, GraphinContext, GraphinData, IG6GraphEvent } from '@antv/graphin';
import React, { useContext, useEffect } from 'react';
import { GlobalDataContext, IGlobalDataContext } from '../contexts/ElectrodeFocusContext';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';
import { getGraphBase, updateGraphCoherence } from '../shared/GraphService';
import { getSingletonDuration, getSingletonFreqList } from '../shared/RequestsService';




const SampleBehavior = () => {
    const { graph, apis } = useContext(GraphinContext);
    const { electrode, setElectrode } = useContext(GlobalDataContext) as IGlobalDataContext;
    const { state } = useContext(GlobalDataContext) as IGlobalDataContext;

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

    useEffect(() => {
        const nodes = graph.getNodes();
        state.nodes.forEach(node => {
            const graphNode = nodes.find(n => n.getModel().id === node.id);
            if (!graphNode) {
                return;
            }
            // update the node style
            const nodeStyle = { ...node.style };
            const updatedNode = { ...graphNode.getModel(), style: nodeStyle };
            graphNode.update(updatedNode);
        });
        // change the edge style
        const edges = graph.getEdges();
        state.edges.forEach(edge => {
            const graphEdge = edges.find(e => e.getModel().id === edge.id);
            if (!graphEdge) {
                return;
            }
            // update the edge style
            const edgeStyle = { ...edge.style };
            const updatedEdge = { ...graphEdge.getModel(), style: edgeStyle };
            graphEdge.update(updatedEdge);
        }
        );
    }, [state]);

    return null;
};

// a component that creates and renders a graphin graph
// it creates its data
// there is a button that changes the data
// the graph is rendered in the div with id="mountNode"
const BasicGraphinGraph = () => {

    const { ActivateRelations, ZoomCanvas, DragCanvas, FitView } = Behaviors;
    const { state, setState, setSharedGraph, electrode, setElectrodeList, freqRange, setFreqRange, freqList, setFreqList, timeRange, setTimeRange, duration, setDuration } = useContext(GlobalDataContext) as IGlobalDataContext;
    const { options, settings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
    const [graphinState, setGraphinState] = React.useState<GraphinData>({ nodes: [], edges: [] });
    const minRef = React.useRef<HTMLInputElement>(null);
    const maxRef = React.useRef<HTMLInputElement>(null);
    const timeRef = React.useRef<HTMLSelectElement>(null);


    const getFrequencyAndTime = async () => {
        let frequencyListAsync = await getSingletonFreqList();
        let durationAsync = await getSingletonDuration();
        return { frequencyListAsync, durationAsync };
    }

    const createBasicGraph = async () => {
        let graph: GraphinData = { nodes: [{ id: "1" }], edges: [] };
        // call getGraphBase to get the base graph data
        graph = await getGraphBase();
        return { ...graph };
    }

    const applyVisualizationOptions = async () => {
        let graph = { ...state };
        graph = options.reduce((acc, option) => {
            if (option.checked) {
                return option.onChange(acc, { ...settings });
            } else {
                if (option.defaultBehavior) {
                    return option.defaultBehavior(acc, { ...settings });
                }
            }
            return acc;
        }, graph);
        return { ...graph };
    }

    const createGraphData = async () => {
        // get the coherence values for the selected frequency and time ranges
        let graph = { ...state };
        graph = await updateGraphCoherence(graph, freqRange, timeRange);
        return { ...graph };
    }

    const [changeVis, setChangeVis] = React.useState<number[]>([1]);

    // change the graph data according to the user's selections
    useEffect(() => {
        console.log(`useEffect`, `getFrequencyAndTime`)
        getFrequencyAndTime().then(({ frequencyListAsync, durationAsync }) => {
            setFreqList(frequencyListAsync);
            setDuration(durationAsync);
        });
        console.log(`useEffect`, `createBasicGraph`)
        createBasicGraph().then((data) => {
            setState(data);
            setSharedGraph({ ...data });
            setChangeVis([...changeVis])
        });
    }, []);

    useEffect(() => {
        if (!state.nodes.length || !state.edges.length) return;
        console.log(`useEffect`, `createGraphData`)
        createGraphData().then((data) => {
            //console.log(`data:`, data);
            setState(data);
            setSharedGraph({ ...data });
            setChangeVis([...changeVis])
        });
    }, [freqRange, timeRange]); // TODO: make this more generic

    useEffect(() => {
        console.log(`useEffect`, `applyVisualizationOptions`)
        applyVisualizationOptions().then((data) => {
            setState(data);
            setSharedGraph({ ...data });
        });
    }, [options, settings, changeVis]);

    // createGraphData();
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