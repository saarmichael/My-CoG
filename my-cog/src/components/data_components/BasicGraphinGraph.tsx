import { INode, NodeConfig } from '@antv/g6';
import Graphin, { Behaviors, GraphinContext, GraphinData, IG6GraphEvent } from '@antv/graphin';
import React, { useContext, useEffect } from 'react';
import { ActiveNodeProps, GlobalDataContext, IGlobalDataContext } from '../../contexts/ElectrodeFocusContext';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../../contexts/VisualGraphOptionsContext';
import { getDuration, getFrequencies } from '../../shared/RequestsService';
import { getGraphBase, getGraphConnectivityMatrix, updateGraphCoherence } from '../../shared/GraphService';


const SampleBehavior = () => {
    const { graph, apis } = useContext(GraphinContext);
    const { electrode, setElectrode } = useContext(GlobalDataContext) as IGlobalDataContext;
    const { state, sharedGraph } = useContext(GlobalDataContext) as IGlobalDataContext;

    useEffect(() => {

        graph.changeSize(1000, 600);
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
        // get the labels from the state
        const nodesLabels: ActiveNodeProps[] = state.nodes.map((node) => {
            const nodeLabel = node.style?.label?.value ? node.style.label.value : node.id;
            return { id: node.id, label: nodeLabel };
        });
        const nodes = graph.getNodes();
        sharedGraph.nodes.forEach(node => {
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
        sharedGraph.edges.forEach(edge => {
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
    }, [sharedGraph]);

    return null;
};

// a component that creates and renders a graphin graph
// it creates its data
// there is a button that changes the data
// the graph is rendered in the div with id="mountNode"
const BasicGraphinGraph = () => {

    const { ActivateRelations, ZoomCanvas, DragCanvas, FitView } = Behaviors;
    const {
        state, setState,
        sharedGraph, setSharedGraph,
        setElectrodeList,
        freqRange,
        setFreqList, freqList,
        timeRange, setDuration,
        activeNodes, setActiveNodes,
        setLoading, chosenFile,
        connectivityType, setConnectivityType,
    } = useContext(GlobalDataContext) as IGlobalDataContext;
    const { options, settings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;

    const getFrequencyAndTime = async () => {
        let frequencyListAsync = await getFrequencies();
        let durationAsync = await getDuration();
        return { frequencyListAsync, durationAsync };
    }

    const createBasicGraph = async () => {
        let graph: GraphinData = { nodes: [{ id: "1" }], edges: [] };
        // call getGraphBase to get the base graph data
        graph = await getGraphBase();
        return { ...graph };
    }

    useEffect(() => {
        console.log(`test`, state);
    }, [state]);

    const applyVisualizationOptions = async () => {
        // deep copy the graph
        const newNodes = state.nodes.map((node) => ({ ...node }));
        const newEdges = state.edges.map((edge) => ({ ...edge }));
        let graph: GraphinData = { nodes: newNodes, edges: newEdges };
        // keep only the active nodes
        let activeNodesId = activeNodes.map((node) => (node.id))
        graph.nodes = graph.nodes.filter((node) => activeNodesId.includes(node.id));
        graph.edges = graph.edges.filter((edge) => activeNodesId.includes(edge.source) && activeNodesId.includes(edge.target));
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
        graph = await getGraphConnectivityMatrix(graph, freqRange, connectivityType, timeRange);
        return { ...graph };
    }

    const updateGraphData = async () => {
        let graph = { ...state };
        graph = await updateGraphCoherence(graph, freqRange, freqList);
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
            setActiveNodes(data.nodes.map((node) => {
                const nodeLabel = node.style?.label?.value ? node.style.label.value : node.id;
                return { id: node.id, label: nodeLabel };
            }));
            setState(data);
            const newNodes = data.nodes.map((node) => ({ ...node }));
            const newEdges = data.edges.map((edge) => ({ ...edge }));
            let graph: GraphinData = { nodes: newNodes, edges: newEdges };
            setSharedGraph(graph);
            setChangeVis([...changeVis])
        });
    }, [chosenFile]);

    useEffect(() => {
        if (!state.nodes.length || !state.edges.length) return;
        setLoading(true);
        console.log(`useEffect`, `createGraphData`)
        createGraphData().then((data) => {
            //console.log(`data:`, data);
            setLoading(false);
            setState(data);
            setChangeVis([...changeVis]);
        });
    }, [timeRange, connectivityType]); // TODO: make this more generic

    useEffect(() => {
        if (!state.nodes.length || !state.edges.length) return;
        console.log(`useEffect`, `createGraphData`)
        updateGraphData().then((data) => {
            //console.log(`data:`, data);
            setState(data);
            setChangeVis([...changeVis]);
        });
    }, [freqRange]);

    useEffect(() => {
        applyVisualizationOptions().then((data) => {
            setSharedGraph(data);
        });
    }, [options, settings, changeVis, activeNodes]);

    useEffect(() => {
        setElectrodeList(state.nodes.map((node) => node.id));
    }, [state]);
    const data = sharedGraph;
    return (
        <div id="mountNode" >
            <div style={{ height: '100%', margin: 'auto', display: 'flex', alignItems: 'center' }}>
                <Graphin data={data} layout={{ type: 'circular', center: [345, 300] }} style={{ height: '100%' }}>
                    <ActivateRelations trigger="click" />
                    <SampleBehavior />
                    <ZoomCanvas disabled={true} />
                    <DragCanvas disabled={true} />
                </Graphin>
            </div>
        </div>
    );
}


export default BasicGraphinGraph;