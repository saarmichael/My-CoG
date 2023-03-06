import { getCoherenceMatrix } from './getters'
import { GraphData, NodeConfig, EdgeConfig } from '@antv/g6';


// function that creates circular positions (x, y)[] for the nodes
export const circularPositions = (n: number, radius: number): number[][] => {
    const positions = [];
    for (let i = 0; i < n; i++) {
        const theta = 2 * Math.PI * i / n;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        positions.push([x, y]);
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

const getEdges = (CM: number[][], nodes: NodeConfig[]): EdgeConfig[] => {
    let edges = [];
    for (let i = 0; i < CM.length; i++) {
        for (let j = 0; j < CM.length; j++) {
            if (i < j) {
                edges.push({
                    source: i.toString(),
                    target: j.toString(),
                    value: CM[i][j],
                });
            }
        }
    }
    return edges;
}


export const getGraphData = (freqBand: string, getPositions?: (n: number, radius: number) => number[][]): GraphData => {
    // get the coherence matrix of the given frequency band
    const coherence_matrix = getCoherenceMatrix(freqBand);
    // get the nodes
    let nodes: NodeConfig[] = getNodes(coherence_matrix, getPositions);
    // get the edges
    let edges: EdgeConfig[] = getEdges(coherence_matrix, nodes);
    // return the graph data
    return {
        nodes: nodes,
        edges: edges,
    };
}