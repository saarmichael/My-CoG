import { getCoherenceMatrix } from './getters'
import { GraphData, NodeConfig, EdgeConfig } from '@antv/g6';


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


export const getGraphData = (freq:number, getPositions?: (n: number, radius: number) => number[][]): GraphData => {
    const CM = getCoherenceMatrix(freq);
    const nodes = getNodes(CM, getPositions);
    const edges = getEdges(CM, nodes);
    return {
        nodes,
        edges,
    }
}