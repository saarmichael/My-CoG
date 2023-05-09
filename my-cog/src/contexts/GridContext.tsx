import exp from "constants";
import React, { createContext, useState, ReactNode } from "react";
import { FreqRange } from '../shared/GraphRelated';
import { TimeInterval } from "../shared/GraphRelated";

export interface IGridFocusContext {
    anchorNode: string;
    setAnchorNode: (electrode: string) => void;
    selectedNode: string;
    setSelectedNode: (electrode: string) => void;
    anchorsLastPosition: {x: number, y:number};
    setAnchorsLastPosition: (position: {x: number, y:number}) => void;
}

interface IGridProviderProps {
    children?: ReactNode;
}

export const GridContext = createContext<IGridFocusContext | null>(null);

export const GridProvider: React.FC<IGridProviderProps> = ({ children }) => {
    const [anchorNode, setAnchorNode] = useState<string>("1");
    const [selectedNode, setSelectedNode] = useState<string>("1");
    const [anchorsLastPosition, setAnchorsLastPosition] = useState<{x: number, y:number}>({ x: 0, y: 0});
    return (
        <GridContext.Provider value={{
            anchorNode, setAnchorNode,
            selectedNode, setSelectedNode,
            anchorsLastPosition, setAnchorsLastPosition
        }}>
            {children}
        </GridContext.Provider>
    );

};