import { IUserEdge, IUserNode, GraphinData } from "@antv/graphin";
import exp from "constants";
import React, { createContext, useState, ReactNode } from "react";
import { changeEdgeWidthGraphin, changeNodeOpacity, changeNodeSize, colorCodeEdges, colorCodeEdgesDefault, colorCodeNodes, colorCodeNodesDefault, edgeWidthGraphinDefault, hideNodeLabel, nodeOpacityDefault, nodeSizeDefault, showEdgeWeight, showNodeLabel, thresholdGraph } from "../shared/GraphService";

export interface IVisSettings {
    edgeColor?: {
        firstColor?: string;
        secondColor?: string;
    }
    edgeWidth?: {
        min: number;
        max: number;
        default?: number;
    }
    nodeSize?: {
        min: number;
        max: number;
        default?: number;
    }
    nodeColor?: {
        firstColor?: string;
        secondColor?: string;
    }
    nodeOpacity?: number;
    threshold?: number;
}

export interface IVisGraphOption {
    label: string;
    checked: boolean;
    onChange: ((graph: GraphinData, settings: IVisSettings) => GraphinData);
    defaultBehavior?: ((graph: GraphinData, settings: IVisSettings) => GraphinData);
}


export interface IVisGraphOptionsContext {
    options: IVisGraphOption[];
    setOptions: (options: IVisGraphOption[]) => void;
    settings: IVisSettings;
    setSettings: (settings: IVisSettings) => void;
}

interface IVisGraphOptionsProviderProps {
    children?: ReactNode;
}

export const VisGraphOptionsContext = createContext<IVisGraphOptionsContext | null>(null);

export const VisGraphOptionsProvider: React.FC<IVisGraphOptionsProviderProps> = ({ children }) => {

    const [options, setOptions] = useState<IVisGraphOption[]>([
        {
            label: "Width View",
            checked: true,
            onChange: changeEdgeWidthGraphin,
            defaultBehavior: edgeWidthGraphinDefault
        },
        {
            label: "Color Coded View",
            checked: true,
            onChange: colorCodeEdges,
            defaultBehavior: colorCodeEdgesDefault
        },
        {
            label: "Threshold View",
            checked: true,
            onChange: thresholdGraph
        },
        {
            label: "Show weights",
            checked: true,
            onChange: showEdgeWeight
        },
        {
            label: "Node Size View",
            checked: true,
            onChange: changeNodeSize,
            defaultBehavior: nodeSizeDefault
        },
        {
            label: "Show Node Label",
            checked: true,
            onChange: showNodeLabel,
            defaultBehavior: hideNodeLabel
        },
        {
            label: "Color coded nodes",
            checked: true,
            onChange: colorCodeNodes,
            defaultBehavior: colorCodeNodesDefault
        },
        {
            label: "Node opacity",
            checked: true,
            onChange: changeNodeOpacity,
            defaultBehavior: nodeOpacityDefault
        }
    ]);
    const [settings, setSettings] = useState<IVisSettings>({
        edgeColor: {
            firstColor: "#000000",
            secondColor: "#000000"
        },
        edgeWidth: {
            min: 1,
            max: 30
        },
        nodeSize: {
            min: 20,
            max: 50,
            default: 20
        },
        nodeColor: {
            firstColor: "#000000",
            secondColor: "#000000"
        },
        nodeOpacity: 0.5,
        threshold: 0.2
    });


    return (
        <VisGraphOptionsContext.Provider
            value={{ options, setOptions, settings, setSettings }}
        >
            {children}
        </VisGraphOptionsContext.Provider >
    );

};