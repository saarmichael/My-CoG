import { IUserNode, IUserEdge } from '@antv/graphin';

export interface BasicGraphResponse {
    layout: string;
    nodes: IUserNode[];
    edges: IUserEdge[];
}