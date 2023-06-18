import { INode, NodeConfig } from "@antv/g6";
import Graphin, { Behaviors, GraphinContext, GraphinData, IUserNode } from "@antv/graphin";
import { useContext, useEffect, useState } from "react";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import { GridContext, IGridFocusContext } from "../../contexts/GridContext";
import { NODE_LABEL_FONT_SIZE, GRID_CENTER_X, GRID_CENTER_Y, WHEEL_ZOOM_FACTOR, NODE_SIZE_FACTOR } from "../../shared/DesignConsts";


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
    const { anchorNode, setAnchorNode,
        setSelectedNode,
        anchorsLastPosition, setAnchorsLastPosition,
        angle, applyMove,
        nodeSize,
    } = useContext(GridContext) as IGridFocusContext;
    const { sharedGraph } = useContext(GlobalDataContext) as IGlobalDataContext;
    const [originalNodes, setOriginalNodes] = useState<IUserNode[]>([]);
    const [graphCenter, setGraphCenter] = useState<{ x: number, y: number }>(graph.getGraphCenterPoint());

    const { setElectrode } = useContext(GlobalDataContext) as IGlobalDataContext;


    useEffect(() => {
        // when triggered, sets the first clicked node as the anchor node
        graph.on('node:click', (e) => {
            const node = e.item as INode;
            const model = node.getModel();
            if (!model.id) {
                return;
            }
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

        graph.on('graph: dragend', (e) => {
            setOriginalNodes(
                graph.getNodes().map(node => {
                    const model = node.getModel() as IUserNode;
                    return { ...model };
                }
                )
            );
            setGraphCenter(graph.getGraphCenterPoint());
        });

        // when scrolling, make the nodes bigger as well
        graph.on('wheelzoom', (e) => {
            const nodes = graph.getNodes();
            nodes.forEach(node => {
                const model = node.getModel();
                const size = model.style?.keyshape?.size - (e.wheelDelta / WHEEL_ZOOM_FACTOR);
                let modelFontSize = model.style?.label?.fontSize - (e.wheelDelta / WHEEL_ZOOM_FACTOR);

                if(!modelFontSize){
                    modelFontSize = NODE_LABEL_FONT_SIZE;
                }
                if (size) {
                    if (Array.isArray(size)) {
                        graph.updateItem(node, { size: [size[0] + NODE_SIZE_FACTOR, size[1] + NODE_SIZE_FACTOR], fontSize: modelFontSize });
                    }
                    else {
                        graph.updateItem(node, { style: { keyshape: { size: size }, label: { fontSize: modelFontSize } } });
                    }
                }
            });
        }
        );

    }, []);

    useEffect(() => {
        setOriginalNodes(
            graph.getNodes().map(node => {
                const model = node.getModel() as IUserNode;
                return { ...model };
            }
            )
        );
        setGraphCenter(graph.getGraphCenterPoint());
    }, [sharedGraph]);

    useEffect(() => {
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
        nodes.forEach(node => {
            const sharedGraphNode = sharedGraph.nodes.find(n => n.id === node.getModel().id);
            if (!sharedGraphNode) {
                return;
            }
            let prevSize = node.getModel().style?.keyshape?.size;
            if (!prevSize) {
                prevSize = sharedGraphNode.style?.keyshape?.size;
            }
            node.update({ style: sharedGraphNode.style });
            if (prevSize) {
                node.update({ style: { keyshape: { size: prevSize } } });
            }
        });
    }, [sharedGraph]);


    return null;
}


// ------------------ EditableGrid ------------------


export const EditableGrid = (props: EditableGridProps) => {

    const { ZoomCanvas, DragCanvas } = Behaviors;
    const { sharedGraph } = useContext(GlobalDataContext) as IGlobalDataContext;
    const { backgroundImg, nodeSize } = useContext(GridContext) as IGridFocusContext;

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
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '600px',
        width: '615px',
    };

    return (
        <>
            <Graphin data={data} modes={{
                default: [
                    'drag-node',
                    {
                        type: 'drag-canvas',
                        enableOptimize: true, // enable the optimize to hide the shapes beside nodes' keyShape
                    },
                ],
            }} layout={{ type: 'grid', center: [GRID_CENTER_X, GRID_CENTER_Y], 'rows': props.N, 'cols': props.M }}
                style={
                    backgroundStyle
                }>
                <ZoomCanvas disabled={false} />
                <GridBehavior
                    originalGraph={createGrid()}
                />
            </Graphin>
        </>
    );
}