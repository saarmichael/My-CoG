import exp from "constants";
import React, { createContext, useState, ReactNode } from "react";

export interface IElectrodeFocusContext {
    electrode: string;
}

interface IElectrodeFocusProviderProps {
    children?: ReactNode;
}

export const ElectrodeFocusContext = createContext<IElectrodeFocusContext | null>(null);

export const ElectrodeFocusProvider: React.FC<IElectrodeFocusProviderProps> = ({ children }) => {
    const [electrode, setElectrode] = useState<IElectrodeFocusContext>({electrode:"electrode1"});
    return (
        <ElectrodeFocusContext.Provider value={electrode}>
            {children}
        </ElectrodeFocusContext.Provider>
    );

};