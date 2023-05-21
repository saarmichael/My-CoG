import Graphin, { Behaviors, GraphinContext, GraphinData, IUserNode } from "@antv/graphin"
import { getSimpleGraphinData } from "../shared/GraphService";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { type } from "os";
import { brainImages } from "../shared/brainImages";
import { GridContext, IGridFocusContext } from "../contexts/GridContext";
import { IGraph, INode, NodeConfig } from "@antv/g6";
import { GlobalDataContext, IGlobalDataContext } from "../contexts/ElectrodeFocusContext";


export interface EditableGridProps {
    N: number;
    M: number; // N x M grid
}

export interface GridBehaviorProps {
    originalGraph: GraphinData;
}

// ------------------ GridBehavior ------------------

const GridBehavior = (props: GridBehaviorProps) => {

    // consume the Graphin instance via GraphinContext
    const { graph } = useContext(GraphinContext);
    const { anchorNode, setAnchorNode, setSelectedNode, anchorsLastPosition, setAnchorsLastPosition, angle, applyMove, rotationReady, setRotationReady } = useContext(GridContext) as IGridFocusContext;
    const { sharedGraph } = useContext(GlobalDataContext) as IGlobalDataContext;
    const [originalNodes, setOriginalNodes] = useState<IUserNode[]>([]);
    const [graphCenter, setGraphCenter] = useState<{ x: number, y: number }>(graph.getGraphCenterPoint());

    const { setElectrode } = useContext(GlobalDataContext) as IGlobalDataContext;


    useEffect(() => {
        // update original nodes positions
        setOriginalNodes(
            graph.getNodes().map(node => {
                const model = node.getModel() as IUserNode;
                return { ...model };
            }
            )
        );
        setGraphCenter(graph.getGraphCenterPoint());
    }, [rotationReady]);

    useEffect(() => {
        // when triggered, sets the first clicked node as the anchor node
        graph.on('node:click', (e) => {
            const node = e.item as INode;
            const model = node.getModel() as NodeConfig;
            setSelectedNode(model.id);
            setElectrode(model.id);
        });

        graph.on('node:dragend', (e) => {
            // if the dragged node is the anchor node, update the anchor node position
            const node = e.item as INode;
            const model = node.getModel() as NodeConfig;
            if (!model) {
                return;
            }
            if (model.id === anchorNode) {
                if (!model.x || !model.y) {
                    return;
                }
                const anchorNodePosition = { x: model.x, y: model.y };
                setAnchorsLastPosition(anchorNodePosition);
            }
        });
    }, []);

    useEffect(() => {
        // set the anchor nodes position
        const anchorNodeModel = graph.findById(anchorNode)?.getModel();
        if (!anchorNodeModel) {
            return;
        }
        if (!anchorNodeModel.x || !anchorNodeModel.y) {
            return;
        }
        const anchorNodePosition = { x: anchorNodeModel.x, y: anchorNodeModel.y };
        setAnchorsLastPosition(anchorNodePosition);
        setRotationReady(false);
    }, [anchorNode]);


    useEffect(() => {
        // when trigered, apply the grid layout but the the anchor node stays the same. all other nodes are moved and the layout is still 'grid'
        // find the delta anchor node position and apply it to all other nodes
        const anchorNodeModel = graph.findById(anchorNode)?.getModel();
        if (!anchorNodeModel) {
            return;
        }
        const anchorNodePosition = { x: anchorNodeModel.x, y: anchorNodeModel.y };
        if (!anchorNodePosition.x || !anchorNodePosition.y) {
            return;
        }
        const delta = { x: anchorNodePosition.x - anchorsLastPosition.x, y: anchorNodePosition.y - anchorsLastPosition.y };
        const nodes = graph.getNodes();
        nodes.forEach(node => {
            const model = node.getModel();
            if (model.x && model.y) {
                if (model.id !== anchorNode) {
                    node.updatePosition({ x: model.x + delta.x, y: model.y + delta.y });
                }
            }
        }
        );
        setAnchorNode('');
    }, [applyMove]);

    useEffect(() => {
        if (!rotationReady) {
            return;
        }
        // rotate the grid by `angle` degrees`
        const angleRad = angle * Math.PI / 180;
        const nodes = graph.getNodes();
        // get the center coordinates of the graph
        const center = graphCenter;
        nodes.forEach(node => {
            const model = node.getModel();
            if (!model.x || !model.y) {
                return;
            }
            // find in original nodes the node with the same id
            const originalNode = originalNodes.find(n => n.id === model.id);
            // find the node radius and angle
            if (!originalNode) {
                return;
            }
            if (!originalNode.x || !originalNode.y) {
                return;
            }
            const originalRadius = Math.sqrt(Math.pow(originalNode.x - graphCenter.x, 2) + Math.pow(originalNode.y - graphCenter.y, 2));
            const originalAngle = Math.atan2(originalNode.y - graphCenter.y, originalNode.x - graphCenter.x);
            const newAngleRad = angleRad + originalAngle;
            const newX = center.x + (originalRadius * Math.cos(newAngleRad));
            const newY = center.y + (originalRadius * Math.sin(newAngleRad));
            node.updatePosition({ x: newX, y: newY });
        });
    }, [angle]);

    useEffect(() => {
        // when `sharedGraph` changes, update the graph style but leave the nodes positions as they are
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
    }, [sharedGraph]);


    return null;
}


// ------------------ EditableGrid ------------------


export const EditableGrid = (props: EditableGridProps) => {

    const { ZoomCanvas, DragCanvas } = Behaviors;
    const { sharedGraph } = useContext(GlobalDataContext) as IGlobalDataContext;
    const { backgroundImg } = useContext(GridContext) as IGridFocusContext;

    const initGrid = () => {
        // create only the nodes without any style at all
        let graph: GraphinData;
        // create the graph with N x M nodes
        graph = { nodes: [], edges: [] };
        // create the nodes
        graph.nodes = sharedGraph.nodes.map(node => {
            return { id: node.id };
        }
        );
        return { ...graph };
    }

    const createGrid = () => {
        // create the nodes and edges using GraphService module
        let graph: GraphinData;
        // create the graph with N x M nodes
        graph = { nodes: [], edges: [] };
        // copy all nodes from the original graph including their styles
        graph.nodes = sharedGraph.nodes.map(node => {
            return { ...node };
        }
        );
        return { ...graph };
    }
    const [gridGraph, setGridGraph] = useState<GraphinData>({ nodes: [], edges: [] });

    useEffect(() => {
        if (sharedGraph && sharedGraph.nodes.length > 0 && !gridGraph.nodes.length) {
            setGridGraph(initGrid());
        }
    }, [sharedGraph]);

    //createGrid();
    const data = gridGraph;

    const backgroundStyle = {
        backgroundImage: `${backgroundImg}`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        width: '100%'
    };

    return (
        <>
            <Graphin data={data} layout={{ type: 'grid', center: [275, 300], 'rows': props.N, 'cols': props.M }}
                style={
                    backgroundStyle
                }>
                <ZoomCanvas disabled={false} />
                <DragCanvas disabled={true} />
                <GridBehavior
                    originalGraph={createGrid()}
                     />
            </Graphin>
        </>
    );
}