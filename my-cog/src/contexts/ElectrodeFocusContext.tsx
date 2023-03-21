import exp from "constants";
import React, { createContext, useState, ReactNode } from "react";

export interface IElectrodeFocusContext {
    electrode: string;
    electrodeList: string[];
    setElectrode: (electrode: string) => void;
    setElectrodeList: (electrodeList: string[]) => void;
}

interface IElectrodeFocusProviderProps {
    children?: ReactNode;
}

export const ElectrodeFocusContext = createContext<IElectrodeFocusContext | null>(null);

export const ElectrodeFocusProvider: React.FC<IElectrodeFocusProviderProps> = ({ children }) => {
    const [electrode, setElectrode] = useState<string>("electrode1");
    const [electrodeList, setElectrodeList] = useState<string[]>([]);
    return (
        <ElectrodeFocusContext.Provider value={{ electrode, electrodeList, setElectrode, setElectrodeList }}>
            {children}
        </ElectrodeFocusContext.Provider>
    );

};