import { getCoherenceMatrix, getFrequencies } from './getters'
import { GraphData, NodeConfig, EdgeConfig } from '@antv/g6';
import { GraphinData, IUserEdge, IUserNode } from '@antv/graphin';
import { interpolate } from 'd3-interpolate'
import { IVisSettings } from '../contexts/VisualGraphOptionsContext';



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

export const changeEdgeWidthGraphin = (edges: IUserEdge[], settings: IVisSettings) => {
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
    return newEdges;
}

const sigmoid = (x: number) => {
    return 1 / (1 + Math.exp(-x));
}

export const showEdgeWeight = (edges: IUserEdge[], settings?: IVisSettings): IUserEdge[] => {
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
    return newEdges;
}

export const colorCodeEdgesDefault = (edges: IUserEdge[], settings: IVisSettings) => {
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
    return newEdges;
};

export const colorCodeEdges = (edges: IUserEdge[], settings: IVisSettings) => {
    // color code the edges based on the value of the edge
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
    return newEdges;
}

// export const thresholdGraphCarry = (threshold: number) => (edges: IUserEdge[]) => {
//     return thresholdGraph(edges, threshold);
// }

export const thresholdGraph = (edges: IUserEdge[], settings: IVisSettings) => {
    let newEdges: IUserEdge[] = [];
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (settings.threshold) {
            if (edge.value > settings.threshold) {
                newEdges.push(edge);
            }
        }
    }
    return newEdges;
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
export const getGraphinData = (freq: FreqRange, getPositions?: (n: number, radius: number) => number[][])
    : GraphinData => {

    return getAverageGraphinData(freq.min, freq.max, getPositions);
}




export const getFrequencyList = (): number[] => {
    return getFrequencies();
}


/*!! THIS FUNCTION IS BETTER OFF BE WRITTEN IN PYTHON DUE TO MEANINGFUL CALCULATIONS OVER FLOATS !!*/
const getAverageCM = (minRange: number, maxRange: number): number[][] => {
    // special case: minRange = maxRange: return the coherence matrix of that frequency or the one that is closest to it
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

export const getAverageGraphinData = (minRange: number, maxRange: number,
    getPositions?: (n: number, radius: number) => number[][]): GraphinData => {
    const CM = getAverageCM(minRange, maxRange);
    return getGraphinDataByCM(CM, getPositions);
}

export interface FreqRange {
    min: number;
    max: number;
}