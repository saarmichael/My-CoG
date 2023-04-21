import { getCoherenceByTime, getCoherenceMatrix, getFrequencies, getFrequenciesTime, getTimeWindows } from './getters'
import { GraphData, NodeConfig, EdgeConfig } from '@antv/g6';
import { GraphinData, IUserEdge, IUserNode } from '@antv/graphin';
import { interpolate } from 'd3-interpolate'
import { IVisSettings } from '../contexts/VisualGraphOptionsContext';
import { CoherenceResponse, TimeInterval } from './Requests';
import { apiGET } from './ServerRequests';
import { getBasicGraph } from './RequestsService';

let singletonGraph: GraphinData;
const coherenceMap = new Map<string, Promise<CoherenceResponse>>();
let singletonFrequencies: number[];


// function that creates circular positions (x, y)[] for the nodes
export const circularPositions = (n: number, radius: number): number[][] => {
    // return positions in a circle with radius r and center (250, 250)
    const positions = [];
    for (let i = 0; i < n; i++) {
        const theta = 2 * Math.PI * i / n;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        // consider the center of the circle to be (250, 250)
        positions.push([x + 250, y + 250]);
    }
    return positions;
}

const getRandomPositions = (n: number): number[][] => {
    const positions = [];
    for (let i = 0; i < n; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        positions.push([x, y]);
    }
    return positions;
}

const getNodes = (CM: number[][], getPositions?: (n: number, radius: number) => number[][]): NodeConfig[] => {
    let nodes = [];
    // get the positions of the nodes
    let positions = getPositions ? getPositions(CM.length, 100) : getRandomPositions(CM.length);
    for (let i = 0; i < CM.length; i++) {
        nodes.push({
            id: "electrode" + i.toString(),
            x: positions[i][0],
            y: positions[i][1],

        });
    }
    return nodes;

}

const getGraphinNodes = (CM: number[][], getPositions?: (n: number, radius: number) => number[][]): IUserNode[] => {
    let nodes: IUserNode[] = [];
    // get the positions of the nodes
    let positions = getPositions ? getPositions(CM.length, 100) : getRandomPositions(CM.length);
    for (let i = 0; i < CM.length; i++) {
        nodes.push({
            id: "electrode" + i.toString(),
            style: {
                label: {
                    value: "electrode" + i.toString(),
                    fontSize: 12,
                }
            },
        });
    }
    return nodes;

}

const getEdges = (CM: number[][], nodes: NodeConfig[]): EdgeConfig[] => {
    let edges = [];
    for (let i = 0; i < CM.length; i++) {
        for (let j = 0; j < CM.length; j++) {
            if (i < j) {
                edges.push({
                    source: "electrode" + i.toString(),
                    target: "electrode" + j.toString(),
                    value: CM[i][j],
                });
            }
        }
    }
    return edges;
}

const getGraphinEdges = (CM: number[][], nodes: IUserNode[]): IUserEdge[] => {
    let edges: IUserEdge[] = [];
    for (let i = 0; i < CM.length; i++) {
        for (let j = 0; j < CM.length; j++) {
            if (i < j) {
                edges.push({
                    source: "electrode" + i.toString(),
                    target: "electrode" + j.toString(),
                    value: CM[i][j],
                    style: {
                        keyshape: {
                            lineWidth: 1,
                            stroke: '#000000',
                            strokeOpacity: 1,
                            endArrow: {
                                path: '0',
                            }
                        },
                    }
                });
            }
        }
    }
    return edges;
}

const getEdgesSum = (edges: IUserEdge[]): number => {
    // sum the values of all pairs of nodes, meaning the sum of the lower triangle of the matrix
    let sum = 0;
    // sum the values of edges
    edges.forEach(edge => {
        sum += edge.value;
    });
    return sum;
}

const getNodesWeighSum = (graph: GraphinData) => {
    // return a dictionary with key the node id and value the sum of the weights of the edges that are connected to it
    const nodes = graph.nodes;
    const edges = graph.edges;
    let nodesWeighSum: { [key: string]: number } = {};
    for (let i = 0; i < nodes.length; i++) {
        nodesWeighSum[nodes[i].id] = 0;
    }
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        nodesWeighSum[edge.source] += edge.value;
        nodesWeighSum[edge.target] += edge.value;
    }
    return nodesWeighSum;
}

export const changeEdgeWidth = (freq: number, edges: any, min: number, max: number) => {
    const CM = getCoherenceMatrix(freq);
    let edgeSum = getEdgesSum(edges);
    let newEdges: EdgeConfig[] = [];
    for (let i = 0; i < edges.length; i++) {
        newEdges.push({
            ...edges[i],
            size: min + (max - min) * (edges[i].value / edgeSum),
        });
    }
    return newEdges;
}

// export const changeEdgeWidthGraphinCarry = (min: number, max: number) => (edges: IUserEdge[]) =>{ 
//     return changeEdgeWidthGraphin(edges, min, max);
// }

export const changeEdgeWidthGraphin = (graph: GraphinData, settings: IVisSettings) => {
    const edges = graph.edges;
    let edgeSum = getEdgesSum(edges);
    let newEdges: IUserEdge[] = [];
    let min = 1;
    let max = 30;
    if (settings.edgeWidth) {
        min = settings.edgeWidth.min;
        max = settings.edgeWidth.max;
    }
    for (let i = 0; i < edges.length; i++) {
        newEdges.push({
            ...edges[i],
            style: {
                // keep the original style and add the new style
                ...edges[i].style,

                keyshape: {
                    ...edges[i].style?.keyshape,
                    lineWidth: min + (max - min) * (edges[i].value / edgeSum),
                    stroke: '#000000',
                    strokeOpacity: 0.8,
                },
            }
        });
    }
    graph.edges = newEdges;
    return {...graph};
}


export const edgeWidthGraphinDefault = (graph: GraphinData, settings: IVisSettings) => {
    // use only the default width (default) to change the width of the edges
    // if default is not specified, use the default width (1)
    let newEdges: IUserEdge[] = [];
    let width = 1;

    if (settings.edgeWidth) {
        if (settings.edgeWidth.default) {
            width = settings.edgeWidth.default;
        }
    }
    for (let i = 0; i < graph.edges.length; i++) {
        newEdges.push({
            ...graph.edges[i],
            style: {
                ...graph.edges[i].style,
                keyshape: {
                    ...graph.edges[i].style?.keyshape,
                    lineWidth: width,
                },
            }
        });
    }
    graph.edges = newEdges;
    return {...graph};
}


export const showEdgeWeight = (graph: GraphinData, settings?: IVisSettings) => {
    const edges = graph.edges;
    let newEdges: IUserEdge[] = [];
    for (let i = 0; i < edges.length; i++) {
        newEdges.push({
            ...edges[i],
            style: {
                ...edges[i].style,
                label: {
                    value: edges[i].value.toFixed(2),
                    fontSize: 10,
                    fill: '#000000',
                }
            }
        });
    }
    graph.edges = newEdges;
    return {...graph};
}

export const colorCodeEdgesDefault = (graph: GraphinData, settings: IVisSettings) => {
    const edges = graph.edges;
    // use only the default color (firstColor) to color code the edges
    // if firstColor is not specified, use the default color (dark blue)
    let newEdges: IUserEdge[] = [];
    let strongColor = 'rgb(108,99,255)';
    if (settings.edgeColor) {
        if (settings.edgeColor.firstColor) {
            strongColor = settings.edgeColor.firstColor;
        }
    }
    for (let i = 0; i < edges.length; i++) {
        newEdges.push({
            ...edges[i],
            style: {
                ...edges[i].style,
                keyshape: {
                    ...edges[i].style?.keyshape,
                    stroke: strongColor,
                    fill: strongColor,
                },
            }
        });
    }
    graph.edges = newEdges;
    return {...graph};
};

const sigmoid = (x: number) => {
    return 1 / (1 + Math.exp(-x));
}

export const colorCodeEdges = (graph: GraphinData, settings: IVisSettings) => {
    // color code the edges based on the value of the edge
    const edges = graph.edges;
    let newEdges: IUserEdge[] = [];
    const edgeSum = getEdgesSum(edges);
    // the color range is from light blue to dark red
    let weakColor = 'rgb(108,99,255)';
    let strongColor = 'red';
    if (settings.edgeColor) {
        if (settings.edgeColor.firstColor) {
            strongColor = settings.edgeColor.firstColor;
        }
        if (settings.edgeColor.secondColor) {
            weakColor = settings.edgeColor.secondColor;
        }
    }
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const value = edge.value;
        // generate the color based on the value
        const edgeWeight = 1 + (30 - 1) * (value / edgeSum);
        const color = interpolate(weakColor, strongColor)(sigmoid(edgeWeight - 1.5));
        newEdges.push({
            ...edge,
            style: {
                ...edge.style,
                keyshape: {
                    ...edge.style?.keyshape,
                    stroke: color,
                    fill: color,
                    strokeOpacity: 0.8,
                },
            }
        });
    }
    graph.edges = newEdges;
    return {...graph};
}

export const colorCodeNodes = (graph: GraphinData, settings: IVisSettings) => {
    let edgeSum = getEdgesSum(graph.edges);
    const nodesWeighSum = getNodesWeighSum(graph);
    let weakColor = 'rgb(108,99,255)';
    let strongColor = 'red';
    if (settings.nodeColor) {
        if (settings.nodeColor.firstColor) {
            strongColor = settings.nodeColor.firstColor;
        }
        if (settings.nodeColor.secondColor) {
            weakColor = settings.nodeColor.secondColor;
        }
    }
    for (let i = 0; i < graph.nodes.length; i++) {
        const nodeWeight = nodesWeighSum[graph.nodes[i].id];
        const nodeWeightPercentage = nodeWeight / edgeSum;
        const color = interpolate(weakColor, strongColor)(sigmoid(nodeWeightPercentage * 30 - 1.5));
        graph.nodes[i].style = {
            ...graph.nodes[i].style,
            keyshape: {
                ...graph.nodes[i].style?.keyshape,
                fill: color,
                stroke: color,
            }
        }
    }
    return {...graph};
}

export const colorCodeNodesDefault = (graph: GraphinData, settings: IVisSettings) => {
    let color = 'rgb(108,99,255)';
    if (settings.nodeColor) {
        if (settings.nodeColor.firstColor) {
            color = settings.nodeColor.firstColor;
        }
    }
    for (let i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].style = {
            ...graph.nodes[i].style,
            keyshape: {
                ...graph.nodes[i].style?.keyshape,
                fill: color,
                stroke: color,
            }
        }
    }
    return {...graph};
}

export const changeNodeOpacity = (graph: GraphinData, settings: IVisSettings) => {
    let edgeSum = getEdgesSum(graph.edges);
    const nodesWeighSum = getNodesWeighSum(graph);
    for (let i = 0; i < graph.nodes.length; i++) {
        const nodeWeight = nodesWeighSum[graph.nodes[i].id];
        const nodeWeightPercentage = nodeWeight / edgeSum;
        graph.nodes[i].style = {
            ...graph.nodes[i].style,
            keyshape: {
                ...graph.nodes[i].style?.keyshape,
                fillOpacity: nodeWeightPercentage,
            }
        }
    }
    return {...graph};
}

export const nodeOpacityDefault = (graph: GraphinData, settings: IVisSettings) => {
    for (let i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].style = {
            ...graph.nodes[i].style,
            keyshape: {
                ...graph.nodes[i].style?.keyshape,
                fillOpacity: 0.2,
            }
        }
    }
    return {...graph};
}

// export const thresholdGraphCarry = (threshold: number) => (edges: IUserEdge[]) => {
//     return thresholdGraph(edges, threshold);
// }

export const thresholdGraph = (graph: GraphinData, settings: IVisSettings) => {
    const edges = graph.edges;
    let newEdges: IUserEdge[] = [];
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (settings.threshold !== undefined) {
            if (edge.value > settings.threshold) {
                newEdges.push(edge);
            }
        }
    }
    graph.edges = newEdges;
    return {...graph};
}


export const getGraphData = (freq: number, getPositions?: (n: number, radius: number) => number[][]): GraphData => {
    const CM = getCoherenceMatrix(freq);
    const nodes = getNodes(CM, getPositions);
    const edges = getEdges(CM, nodes);
    return {
        nodes,
        edges,
    }
}

export const getGraphinDataByCM = (CM: number[][], getPositions?: (n: number, radius: number) => number[][])
    : GraphinData => {
    const nodes = getGraphinNodes(CM, getPositions);
    const edges = getGraphinEdges(CM, nodes);
    return {
        nodes,
        edges,
    }
}

const buildRequest = (time?: TimeInterval) => {
    let url = 'http://localhost:5000/time?';
    if (time) {
        url += 'start=' + time?.start + '&end=' + time?.end;
    }
    return url;
}

const applyCMOnGraph = (graph: GraphinData, CM: number[][]) => {
    // iterate over edges and update their values according to the CM
    graph.edges.forEach((edge, index) => {
        const sourceIndex = graph.nodes.findIndex(node => node.id === edge.source);
        const targetIndex = graph.nodes.findIndex(node => node.id === edge.target);
        const value = CM[sourceIndex][targetIndex];
        graph.edges[index].value = value;
    });
    return {...graph};
}

export const updateGraphCoherence = async (graph: GraphinData, freq: FreqRange, time?: TimeInterval)
    : Promise<GraphinData> => {
    const url = buildRequest(time);
    let response: CoherenceResponse | undefined;
    if (!coherenceMap.has(url)) {
        coherenceMap.set(url, apiGET<CoherenceResponse>(url));
    }
    response = await coherenceMap.get(url);
    if (response === undefined) {
        return {...graph};
    }
    const CM = getAverageCMbyCM(response.CM, response.f, freq);
    const newGraph = applyCMOnGraph(graph, CM);
    return newGraph;
}

export const getGraphBase = async (): Promise<GraphinData> => {
    // if the singleton doesnt exists, ask the server for the data
    if(!singletonGraph) { 
        singletonGraph = await getBasicGraph();
    }
    return singletonGraph;
}

export const getSimpleGraphinData = (): GraphinData => {
    const CM = getCoherenceMatrix(0);
    const nodes = getGraphinNodes(CM);
    const edges = getGraphinEdges(CM, nodes);
    return {
        nodes,
        edges,
    }
}




export const getFrequencyList = (): number[] => {
    return getFrequencies();
}

export const getTimeIntervals = (): number[] => {
    return getTimeWindows();
}


/*!! THIS FUNCTION IS BETTER OFF BE WRITTEN IN PYTHON DUE TO MEANINGFUL CALCULATIONS OVER FLOATS !!*/
const getAverageCM = (freq: FreqRange): number[][] => {
    // special case: minRange = maxRange: return the coherence matrix of that frequency or the one that is closest to it
    const minRange = freq.min;
    const maxRange = freq.max;
    if (minRange === maxRange) {
        return getCoherenceMatrix(minRange);
    }
    // get the average coherence matrix over the range [minRange, maxRange]
    const freqList = getFrequencies();
    let CM = getCoherenceMatrix(freqList[0]);
    let numOfMatrices = 0;
    for (let i = 1; i < freqList.length; i++) {
        if (freqList[i] >= minRange && freqList[i] <= maxRange) {
            numOfMatrices++;
            const newCM = getCoherenceMatrix(freqList[i]);
            for (let j = 0; j < CM.length; j++) {
                for (let k = 0; k < CM.length; k++) {
                    CM[j][k] += newCM[j][k];
                }
            }
        }
    }
    // divide the sum by the number of matrices in the range
    for (let j = 0; j < CM.length; j++) {
        for (let k = 0; k < CM.length; k++) {
            CM[j][k] /= numOfMatrices;
        }
    }
    return CM;
}

const getAverageCMbyCM = (CM: number[][][], freqs: number[], range: FreqRange): number[][] => {
    // special case: minRange = maxRange: return the coherence matrix of that frequency or the one that is closest to it
    const minRange = range.min;
    const maxRange = range.max;
    if (minRange === maxRange) {
        // find the index of the closest frequency to minRange and return the CM at that index
        let index = freqs.findIndex((freq) => freq >= minRange);
        if (index === -1) {
            index = freqs.length - 1;
        }
        return CM[index];
    }
    // get the average coherence matrix over the range [minRange, maxRange]
    let averageCM = CM[0];
    let numOfMatrices = 0;
    for (let i = 1; i < freqs.length; i++) {
        if (freqs[i] >= minRange && freqs[i] <= maxRange) {
            numOfMatrices++;
            for (let j = 0; j < averageCM.length; j++) {
                for (let k = 0; k < averageCM.length; k++) {
                    averageCM[j][k] += CM[i][j][k];
                }
            }
        }
    }
    // divide the sum by the number of matrices in the range
    for (let j = 0; j < averageCM.length; j++) {
        for (let k = 0; k < averageCM.length; k++) {
            averageCM[j][k] /= numOfMatrices;
        }
    }
    return averageCM;
};


export const getAverageGraphinData = (freq: FreqRange,
    getPositions?: (n: number, radius: number) => number[][], time?: number): GraphinData => {
    if (time !== undefined) {
        // get the CM at the given time
        const timeCMs = getCoherenceByTime(time);
        const frequencies = getFrequenciesTime();
        return getGraphinDataByCM(getAverageCMbyCM(timeCMs, frequencies, freq), getPositions);
    } else {
        const CM = getAverageCM(freq);
        return getGraphinDataByCM(CM, getPositions);
    }
}

export interface FreqRange {
    min: number;
    max: number;
}


export const changeNodeSize = (graph: GraphinData, settings: IVisSettings) => {
    const nodes = graph.nodes;
    let edgeSum = getEdgesSum(graph.edges);
    const nodesWeighSum = getNodesWeighSum(graph);
    let newNodes: IUserNode[] = [];
    let min = 1;
    let max = 30;
    if (settings.nodeSize) {
        min = settings.nodeSize.min;
        max = settings.nodeSize.max;
    }
    for (let i = 0; i < nodes.length; i++) {
        graph.nodes[i].style = {
            ...graph.nodes[i].style,
            keyshape: {
                ...graph.nodes[i].style?.keyshape,
                size: min + (max - min) * (nodesWeighSum[nodes[i].id] / edgeSum),
            }
        };
    }
    return {...graph};
}

export const nodeSizeDefault = (graph: GraphinData, settings: IVisSettings) => {
    // set the node size to the default value
    const nodes = graph.nodes;
    let newNodes: IUserNode[] = [];
    let size = 10;
    if (settings.nodeSize) {
        if (settings.nodeSize.default) {
            size = settings.nodeSize.default;
        }
    }
    for (let i = 0; i < nodes.length; i++) {
        newNodes.push({
            ...nodes[i],
            style: {
                // keep the original style and add the new style
                ...nodes[i].style,
                keyshape: {
                    ...nodes[i].style?.keyshape,
                    size: size,
                },
            }
        });
    }
    graph.nodes = newNodes;
    return {...graph};
}


const getIdNum = (id: string): string => {
    let num: string = '';
    for (let i = id.length - 1; i >= 0; i--) {
        if (id[i] >= '0' && id[i] <= '9') {
            num = id[i] + num;
        }
        else {
            break;
        }
    }
    return num;
}


export const showNodeLabel = (graph: GraphinData, settings: IVisSettings) => {
    for (let i = 0; i < graph.nodes.length; i++) {
        // get the number og the node (it is the last chars of the id. notice that the number could be more than one digit)
        const idNum = getIdNum(graph.nodes[i].id);
        graph.nodes[i].style = {
            ...graph.nodes[i].style,
            label: {
                ...graph.nodes[i].style?.label,
                value: idNum,
                position: 'center',
            },
            keyshape: {
                ...graph.nodes[i].style?.keyshape,
            }
        };


    }
    return {...graph};
}

export const hideNodeLabel = (graph: GraphinData, settings: IVisSettings) => {
    for (let i = 0; i < graph.nodes.length; i++) {
        graph.nodes[i].style = {
            ...graph.nodes[i].style,
            label: {
                ...graph.nodes[i].style?.label,
                value: '',
            }
        };

    }
    return {...graph};
}