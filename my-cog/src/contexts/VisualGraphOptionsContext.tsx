import exp from "constants";
import React, { createContext, useState, ReactNode } from "react";

export interface IVisGraphOptionsContext {
    widthView: boolean;
    setWidthView: (widthView: boolean) => void;
    colorCodedView: boolean;
    setColorCodedView: (colorCodedView: boolean) => void;
    thresholdView: boolean;
    setThresholdView: (thresholdView: boolean) => void;
}

interface IVisGraphOptionsProviderProps {
    children?: ReactNode;
}

export const VisGraphOptionsContext = createContext<IVisGraphOptionsContext | null>(null);

export const VisGraphOptionsProvider: React.FC<IVisGraphOptionsProviderProps> = ({ children }) => {
    const [widthView, setWidthView] = useState<boolean>(true);
    const [colorCodedView, setColorCodedView] = useState<boolean>(false);
    const [thresholdView, setThresholdView] = useState<boolean>(false);
    return (
        <VisGraphOptionsContext.Provider
            value={{ widthView, setWidthView, colorCodedView, setColorCodedView, thresholdView, setThresholdView }}
        >
            {children}
        </VisGraphOptionsContext.Provider>
    );

};