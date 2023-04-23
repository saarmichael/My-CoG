import exp from "constants";
import React, { createContext, useState, ReactNode } from "react";
import { FreqRange } from "../shared/GraphService";
import { TimeInterval } from "../shared/Requests";

export interface IElectrodeFocusContext {
    electrode: string;
    setElectrode: (electrode: string) => void;
    electrodeList: string[];
    setElectrodeList: (electrodeList: string[]) => void;
    freqRange: FreqRange
    setFreqRange: (freqRange: FreqRange) => void;
    timeRange: TimeInterval
    setTimeRange: (timeRange: TimeInterval) => void;
}

interface IElectrodeFocusProviderProps {
    children?: ReactNode;
}

export const GlobalDataContext = createContext<IElectrodeFocusContext | null>(null);

export const GlobalDataProvider: React.FC<IElectrodeFocusProviderProps> = ({ children }) => {
    const [electrode, setElectrode] = useState<string>("electrode1");
    const [electrodeList, setElectrodeList] = useState<string[]>([]);
    const [freqRange, setFreqRange] = useState<FreqRange>({ min: 0, max: 0 });
    const [timeRange, setTimeRange] = useState<TimeInterval>({ start: 0, end: 0 });
    return (
        <GlobalDataContext.Provider value={{
            electrode, setElectrode,
            electrodeList, setElectrodeList,
            freqRange, setFreqRange,
            timeRange, setTimeRange
        }}>
            {children}
        </GlobalDataContext.Provider>
    );

};