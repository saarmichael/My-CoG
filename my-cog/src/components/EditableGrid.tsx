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
    applyMove: any;
    anchorTrigger: any;
    rotationReady: any;
}

export interface GridBehaviorProps {
    applyMove: any;
    trigger: any;
    rotationReady: any;
    originalGraph: GraphinData;
}

// ------------------ GridBehavior ------------------

const GridBehavior = (props: GridBehaviorProps) => {

    // consume the Graphin instance via GraphinContext
    const { graph } = useContext(GraphinContext);
    const { anchorNode, setAnchorNode, selectedNode, setSelectedNode, anchorsLastPosition, setAnchorsLastPosition, angle } = useContext(GridContext) as IGridFocusContext;
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
    }, [props.rotationReady]);

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
    }, [props.applyMove]);

    useEffect(() => {
        if (!props.rotationReady) {
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

    return null;
}


// ------------------ EditableGrid ------------------


export const EditableGrid = (props: EditableGridProps) => {

    const { ZoomCanvas, DragCanvas } = Behaviors;
    const { state } = useContext(GlobalDataContext) as IGlobalDataContext;

    const createGrid = () => {
        // create the nodes and edges using GraphService module
        let graph: GraphinData;
        // create the graph with N x M nodes
        graph = { nodes: [], edges: [] };
        state.nodes.forEach(node => {
            graph.nodes.push({ id: node.id, label: node.label, style: { keyshape: { fill: node.color } } });
        });
        // update nodes color 
        return { ...graph };
    }
    const [gridState, setGridState] = useState<GraphinData>(createGrid());

    useEffect(() => {
        setGridState(createGrid());
    }, []);

    createGrid();
    const data = gridState;

    return (
        <>
            <Graphin data={data} layout={{ type: 'grid', center: [275, 300], 'rows': props.N, 'cols': props.M }} style={{ width: "100%" }}>
                <ZoomCanvas disabled={true} />
                <DragCanvas disabled={true} />
                <GridBehavior applyMove={props.applyMove} trigger={props.anchorTrigger} originalGraph={createGrid()} rotationReady={props.rotationReady} />
            </Graphin>
        </>
    );
}