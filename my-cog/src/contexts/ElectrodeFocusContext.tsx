import exp from "constants";
import React, { createContext, useState, ReactNode } from "react";

export interface IElectrodeFocusContext {
    electrode: string;
    setElectrode: (electrode: string) => void;
}

interface IElectrodeFocusProviderProps {
    children?: ReactNode;
}

export const ElectrodeFocusContext = createContext<IElectrodeFocusContext | null>(null);

export const ElectrodeFocusProvider: React.FC<IElectrodeFocusProviderProps> = ({ children }) => {
    const [electrode, setElectrode] = useState<string>("electrode1");
    return (
        <ElectrodeFocusContext.Provider value={{ electrode, setElectrode }}>
            {children}
        </ElectrodeFocusContext.Provider>
    );

};