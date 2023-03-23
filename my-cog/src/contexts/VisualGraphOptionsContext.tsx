import { IUserEdge } from "@antv/graphin";
import exp from "constants";
import React, { createContext, useState, ReactNode } from "react";
import { changeEdgeWidthGraphinCarry, colorCodeEdges, colorCodeEdgesCarry, thresholdGraphCarry } from "../shared/GraphService";

export interface IVisGraphOption {
    label: string;
    checked: boolean;
    onChange: ((edges: IUserEdge[]) => IUserEdge[]);
}

export interface IVisGraphOptionsContext {
    options: IVisGraphOption[];
    setOptions: (options: IVisGraphOption[]) => void;
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
            onChange: changeEdgeWidthGraphinCarry(1, 30)
        },
        {
            label: "Color Coded View",
            checked: true,
            onChange: colorCodeEdges
        },
        {
            label: "Threshold View",
            checked: true,
            onChange: thresholdGraphCarry(0.2)
        }
    ]);

    return (
        <VisGraphOptionsContext.Provider
            value={{ options, setOptions }}
        >
            {children}
        </VisGraphOptionsContext.Provider >
    );

};