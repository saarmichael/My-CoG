import { getCoherenceMatrix, getFrequencies } from './getters'
import { GraphData, NodeConfig, EdgeConfig } from '@antv/g6';
import { GraphinData, IUserEdge, IUserNode } from '@antv/graphin';


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
                        label: {
                            value: CM[i][j].toString(),
                            fontSize: 10,
                        }
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

export const changeEdgeWidthGraphin = (edges: IUserEdge[], min: number, max: number) => {
    let edgeSum = getEdgesSum(edges);
    let newEdges: IUserEdge[] = [];
    for (let i = 0; i < edges.length; i++) {
        newEdges.push({
            ...edges[i],
            style: {
                keyshape: {
                    lineWidth: min + (max - min) * (edges[i].value / edgeSum),
                    stroke: '#000000',
                    strokeOpacity: 0.8,
                },
                label: {
                    // make the label to be the value of the edge but only two decimal places
                    value: edges[i].value.toFixed(2),
                    fontSize: 12,
                    stroke: '#2A1802',
                    fill: 'blue',
                    opacity: 0.6,
                }
            }
        });
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
export const getGraphinData = (freq: number, getPositions?: (n: number, radius: number) => number[][])
    : GraphinData => {
    const CM = getCoherenceMatrix(freq);
    return getGraphinDataByCM(CM, getPositions);
}




export const getFrequencyList = (): number[] => {
    return getFrequencies();
}


/*!! THIS FUNCTION IS BETTER OFF BE WRITTEN IN PYTHON DUE TO MEANINGFUL CALCULATIONS OVER FLOATS !!*/
const getAverageCM = (minRange: number, maxRange: number): number[][] => {
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