import Graphin, { Behaviors, GraphinContext, GraphinData } from "@antv/graphin"
import { getSimpleGraphinData } from "../shared/GraphService";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { type } from "os";
import { brainImages } from "../shared/brainImages";
import { GridContext, IGridFocusContext } from "../contexts/GridContext";
import { INode, NodeConfig } from "@antv/g6";


export interface EditableGridProps {
    N: number;
    M: number; // N x M grid
    applyMove: any;
    anchorTrigger: any;
}

export interface GridBehaviorProps {
    applyMove: any;
    trigger: any;
}

// ------------------ GridBehavior ------------------

const GridBehavior = (props: GridBehaviorProps) => {

    // consume the Graphin instance via GraphinContext
    const { graph } = useContext(GraphinContext);
    const { anchorNode, setAnchorNode, selectedNode, setSelectedNode, anchorsLastPosition, setAnchorsLastPosition } = useContext(GridContext) as IGridFocusContext;


    useEffect(() => {
        // when triggered, sets the first clicked node as the anchor node
        graph.on('node:click', (e) => {
            const node = e.item as INode;
            const model = node.getModel() as NodeConfig;
            setSelectedNode(model.id);
        });

        graph.on('node:dragend', (e) => {
            // if the dragged node is the anchor node, update the anchor node position
            const node = e.item as INode;
            const model = node.getModel() as NodeConfig;
            if(!model){ 
                return;
            }
            if (model.id === anchorNode) {
                if(!model.x || !model.y){
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
    }, [props.applyMove]);

    return null;
}


// ------------------ EditableGrid ------------------


export const EditableGrid = (props: EditableGridProps) => {

    const { ZoomCanvas, DragCanvas } = Behaviors;

    const createGrid = () => {
        // create the nodes and edges using GraphService module
        let graph: GraphinData;
        // create the graph with N x M nodes
        graph = { nodes: [], edges: [] };
        for (let i = 0; i < props.N; i++) {
            for (let j = 0; j < props.M; j++) {
                graph.nodes.push({ id: i + "," + j, label: i + "," + j });
            }
        }
        return { ...graph };
    }
    const [state, setState] = useState<GraphinData>(createGrid());

    useEffect(() => {
        setState(createGrid());
    }, []);

    createGrid();
    const data = state;

    return (
        <>
            <Graphin data={data} layout={{ type: 'grid', center: [275, 300] }} style={{ width: "100%" }}>
                <GridBehavior applyMove={props.applyMove} trigger={props.anchorTrigger} />
                <ZoomCanvas disabled={true} />
                <DragCanvas disabled={true} />
            </Graphin>
        </>
    )

}