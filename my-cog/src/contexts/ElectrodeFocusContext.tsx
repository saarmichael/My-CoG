import exp from "constants";
import React, { createContext, useState, ReactNode } from "react";
import { FreqRange } from '../shared/GraphRelated';
import { TimeInterval } from "../shared/GraphRelated";

export interface IElectrodeFocusContext {
    electrode: string;
    setElectrode: (electrode: string) => void;
    electrodeList: string[];
    setElectrodeList: (electrodeList: string[]) => void;
    freqRange: FreqRange
    setFreqRange: (freqRange: FreqRange) => void;
    freqList: number[];
    setFreqList: (freqList: number[]) => void;
    timeRange: TimeInterval
    setTimeRange: (timeRange: TimeInterval) => void;
    duration: number;
    setDuration: (timeList: number) => void;
}

interface IElectrodeFocusProviderProps {
    children?: ReactNode;
}

export const GlobalDataContext = createContext<IElectrodeFocusContext | null>(null);

export const GlobalDataProvider: React.FC<IElectrodeFocusProviderProps> = ({ children }) => {
    const [electrode, setElectrode] = useState<string>("electrode1");
    const [electrodeList, setElectrodeList] = useState<string[]>([]);
    const [freqRange, setFreqRange] = useState<FreqRange>({ min: 0, max: 0 });
    const [freqList, setFreqList] = useState<number[]>([0,1]);
    const [timeRange, setTimeRange] = useState<TimeInterval>({ resolution: 's', start: 0, end: 0 });
    const [duration, setDuration] = useState<number>(2);
    return (
        <GlobalDataContext.Provider value={{
            electrode, setElectrode,
            electrodeList, setElectrodeList,
            freqRange, setFreqRange,
            freqList, setFreqList,
            timeRange, setTimeRange,
            duration, setDuration
        }}>
            {children}
        </GlobalDataContext.Provider>
    );

};