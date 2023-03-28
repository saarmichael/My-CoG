import { IUserEdge, IUserNode, GraphinData } from "@antv/graphin";
import exp from "constants";
import React, { createContext, useState, ReactNode } from "react";
import { changeEdgeWidthGraphin, colorCodeEdges, colorCodeEdgesDefault, showEdgeWeight, thresholdGraph } from "../shared/GraphService";

export interface IVisSettings {
    edgeColor?: {
        firstColor?: string;
        secondColor?: string;
    }
    nodeColor?: {
        firstColor: string;
        secondColor?: string;
    }
    edgeWidth?: {
        min: number;
        max: number;
    }
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
            onChange: changeEdgeWidthGraphin
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
        }
    ]);
    const [settings, setSettings] = useState<IVisSettings>({
        edgeColor: {
            firstColor: "#000000",
            secondColor: "#000000"
        },
        nodeColor: {
            firstColor: "#000000",
            secondColor: "#000000"
        },
        edgeWidth: {
            min: 1,
            max: 30
        },
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