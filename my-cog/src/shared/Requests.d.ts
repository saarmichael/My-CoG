import { IUserNode, IUserEdge } from '@antv/graphin';

export interface BasicGraphResponse {
    layout: string;
    nodes: IUserNode[];
    edges: IUserEdge[];
}

export interface CoherenceResponse {
    f: number[];
    CM: number[][][]; // coherence matrices for each frequency
}

export interface TimeInterval {
    start: number;
    end: number;
}