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
    value?: number;
    needValue: boolean;
    settingName?: string;
}


export interface IVisGraphOptionsContext {
    options: IVisGraphOption[];
    setOptions: (options: IVisGraphOption[]) => void;
    settings: IVisSettings;
    setSettings: (settings: IVisSettings) => void;
    generalOptions: IGeneralGraphOption[];
    setGeneralOptions: (options: IGeneralGraphOption[]) => void;
}

export interface IGeneralGraphOption {
    label: string;
    checked: boolean;
    value?: string;
}

export interface IGeneralOptionsContext {
    options: IGeneralGraphOption[];
}

interface IVisGraphOptionsProviderProps {
    children?: ReactNode;
}

export const VisGraphOptionsContext = createContext<IVisGraphOptionsContext | null>(null);

export const VisGraphOptionsProvider: React.FC<IVisGraphOptionsProviderProps> = ({ children }) => {

    const [options, setOptions] = useState<IVisGraphOption[]>([
        {
            label: "Width View",
            checked: false,
            onChange: changeEdgeWidthGraphin,
            defaultBehavior: edgeWidthGraphinDefault,
            needValue: false
        },
        {
            label: "Color Coded View",
            checked: false,
            onChange: colorCodeEdges,
            defaultBehavior: colorCodeEdgesDefault,
            needValue: false
        },
        {
            label: "Threshold View",
            checked: false,
            onChange: thresholdGraph,
            needValue: true,
            settingName: "threshold"
        },
        {
            label: "Show weights",
            checked: false,
            onChange: showEdgeWeight,
            needValue: false
        },
        {
            label: "Node Size View",
            checked: false,
            onChange: changeNodeSize,
            defaultBehavior: nodeSizeDefault,
            needValue: false
        },
        {
            label: "Show Node Label",
            checked: true,
            onChange: showNodeLabel,
            defaultBehavior: hideNodeLabel,
            needValue: false
        },
        {
            label: "Color coded nodes",
            checked: false,
            onChange: colorCodeNodes,
            defaultBehavior: colorCodeNodesDefault,
            needValue: false
        },
        {
            label: "Node opacity",
            checked: false,
            onChange: changeNodeOpacity,
            defaultBehavior: nodeOpacityDefault,
            needValue: false
        }
    ]);
    const [settings, setSettings] = useState<IVisSettings>({
        edgeColor: {
            firstColor: "#A9A9A9",
            secondColor: "#A9A9A9"
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

    const [generalOptions, setGeneralOptions] = useState<IGeneralGraphOption[]>([
        {
            label: "time windows",
            checked: false
        },
    ]);

    return (
        <VisGraphOptionsContext.Provider
            value={{ options, setOptions, settings, setSettings, generalOptions, setGeneralOptions }}
        >
            {children}
        </VisGraphOptionsContext.Provider >
    );

};