import React, { ReactNode, createContext, useState } from "react";


export interface IGridFocusContext {
    anchorNode: string;
    setAnchorNode: (electrode: string) => void;
    selectedNode: string;
    setSelectedNode: (electrode: string) => void;
    anchorsLastPosition: {x: number, y:number};
    setAnchorsLastPosition: (position: {x: number, y:number}) => void;
    angle: number;
    setAngle: (angle: number) => void;
    backgroundImg: string;
    setBackgroundImg: (backgroundImg: string) => void;
    backImgList: Map<string, string>; // <image name, image url>
    setBackImgList: (backImgList: Map<string, string>) => void;
    applyMove: any;
    setApplyMove: (applyMove: any) => void;
    nodeSize: {trigger: any, bigger: boolean};
    setNodeSize: (nodeSize: {trigger: any, bigger: boolean}) => void;
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
    const [backgroundImg, setBackgroundImg] = useState<string>("");
    const [backImgList, setBackImgList] = useState<Map<string, string>>(new Map());
    const [applyMove, setApplyMove] = useState<any>([]);
    const [nodeSize, setNodeSize] = useState<{trigger: any, bigger: boolean}>({trigger: [], bigger: false});
    return (
        <GridContext.Provider value={{
            anchorNode, setAnchorNode,
            selectedNode, setSelectedNode,
            anchorsLastPosition, setAnchorsLastPosition,
            angle, setAngle,
            backgroundImg, setBackgroundImg,
            backImgList, setBackImgList,
            applyMove, setApplyMove,
            nodeSize, setNodeSize,
        }}>
            {children}
        </GridContext.Provider>
    );

};