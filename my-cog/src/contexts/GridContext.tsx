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
    angle: number;
    setAngle: (angle: number) => void;
    rotationReady: boolean;
    setRotationReady: (rotationReady: boolean) => void;
}

interface IGridProviderProps {
    children?: ReactNode;
}

export const GridContext = createContext<IGridFocusContext | null>(null);

export const GridProvider: React.FC<IGridProviderProps> = ({ children }) => {
    const [anchorNode, setAnchorNode] = useState<string>("1");
    const [selectedNode, setSelectedNode] = useState<string>("1");
    const [anchorsLastPosition, setAnchorsLastPosition] = useState<{x: number, y:number}>({ x: 0, y: 0});
    const [angle, setAngle] = useState<number>(0);
    const [rotationReady, setRotationReady] = useState<boolean>(false);
    return (
        <GridContext.Provider value={{
            anchorNode, setAnchorNode,
            selectedNode, setSelectedNode,
            anchorsLastPosition, setAnchorsLastPosition,
            angle, setAngle,
            rotationReady, setRotationReady,
        }}>
            {children}
        </GridContext.Provider>
    );

};