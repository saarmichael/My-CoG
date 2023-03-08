import { getCoherenceMatrix } from './getters'
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
            id: i.toString(),
            x: positions[i][0],
            y: positions[i][1],
        });
    }
    return nodes;

}

const getGraphinNodes = (CM: number[][], getPositions?: (n: number, radius: number) => number[][]): IUserNode[] => {
    let nodes = [];
    // get the positions of the nodes
    let positions = getPositions ? getPositions(CM.length, 100) : getRandomPositions(CM.length);
    for (let i = 0; i < CM.length; i++) {
        nodes.push({
            id: "node" + i.toString(),
            x: positions[i][0],
            y: positions[i][1],
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
                    source: "node" + i.toString(),
                    target: "node" + j.toString(),
                    value: CM[i][j],
                });
            }
        }
    }
    return edges;
}

const getGraphinEdges = (CM: number[][], nodes: IUserNode[]): IUserEdge[] => {
    let edges = [];
    for (let i = 0; i < CM.length; i++) {
        for (let j = 0; j < CM.length; j++) {
            if (i < j) {
                edges.push({
                    source: "node" + i.toString(),
                    target: "node" + j.toString(),
                    value: CM[i][j],
                });
            }
        }
    }
    return edges;
}

const getEdgeRelativeSizes = (CM: number[][]): number[] => {
    // sum the values of all pairs of nodes, meaning the sum of the lower triangle of the matrix
    let sum = 0;
    for (let i = 0; i < CM.length; i++) {
        for (let j = 0; j < CM.length; j++) {
            if (i < j) {
                sum += CM[i][j];
            }
        }
    }
    let relativeValues: number[] = [];
    for (let i = 0; i < CM.length; i++) {
        for (let j = 0; j < CM.length; j++) {
            if (i < j) {
                relativeValues.push(CM[i][j] / sum);
            }
        }
    }
    return relativeValues;
}

export const changeEdgeWidth = (freq: number, edges: any, min: number, max: number) => {
    const CM = getCoherenceMatrix(freq);
    let relativeValues = getEdgeRelativeSizes(CM);
    let newEdges: EdgeConfig[] = [];
    for (let i = 0; i < edges.length; i++) {
        newEdges.push({
            ...edges[i],
            size: min + (max - min) * relativeValues[i],
        });
    }
    return newEdges;
}

export const changeEdgeWidthGraphin = (freq: number, edges: any, min: number, max: number) => {
    const CM = getCoherenceMatrix(freq);
    let relativeValues = getEdgeRelativeSizes(CM);
    let newEdges: IUserEdge[] = [];
    for (let i = 0; i < edges.length; i++) {
        newEdges.push({
            ...edges[i],
            style: {
                keyshape: {
                    lineWidth: min + (max - min) * relativeValues[i]
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

export const getGraphinData = (freq: number, getPositions?: (n: number, radius: number) => number[][])
    : GraphinData => {
        const CM = getCoherenceMatrix(freq);
        const nodes = getGraphinNodes(CM, getPositions);
        const edges = getGraphinEdges(CM, nodes);
        return {
            nodes,
            edges,
        }
}