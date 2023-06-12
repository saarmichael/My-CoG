import exp from "constants";
import React, { createContext, useState, ReactNode } from "react";
import { FreqRange } from '../shared/GraphRelated';
import { TimeInterval } from "../shared/GraphRelated";
import { GraphinData } from "@antv/graphin";

export interface ActiveNodeProps {
    id: string;
    label: string;
}


export interface IGlobalDataContext {
    state: GraphinData;
    setState: (state: GraphinData) => void;
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
    sharedGraph: GraphinData;
    setSharedGraph: (sharedGraph: GraphinData) => void;
    chosenFile: string;
    setChosenFile: (chosenFile: string) => void;
    activeNodes: ActiveNodeProps[];
    setActiveNodes: (activeNodes: ActiveNodeProps[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    connectivityType: string;
    setConnectivityType: (connectivityType: string) => void;
    isAnimating: boolean;
    setIsAnimating: (isAnimating: boolean) => void;
}

interface IGlobalDataProviderProps {
    children?: ReactNode;
}

export const GlobalDataContext = createContext<IGlobalDataContext | null>(null);

export const GlobalDataProvider: React.FC<IGlobalDataProviderProps> = ({ children }) => {
    const [state, setState] = React.useState<GraphinData>({ nodes: [], edges: [] });
    const [electrode, setElectrode] = useState<string>("electrode1");
    const [electrodeList, setElectrodeList] = useState<string[]>([]);
    const [freqRange, setFreqRange] = useState<FreqRange>({ min: 0, max: 0 });
    const [freqList, setFreqList] = useState<number[]>([0,1]);
    const [timeRange, setTimeRange] = useState<TimeInterval>({ resolution: 's', start: 0, end: 0 });
    const [duration, setDuration] = useState<number>(2);
    const [sharedGraph, setSharedGraph] = useState<GraphinData>({ nodes: [], edges: [] });
    const [chosenFile, setChosenFile] = useState<string>("");
    const [activeNodes, setActiveNodes] = React.useState<ActiveNodeProps[]>([]);
    const [loading , setLoading] = React.useState<boolean>(false);
    const [connectivityType, setConnectivityType] = React.useState<string>("coherence");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    return (
        <GlobalDataContext.Provider value={{
            state, setState,
            electrode, setElectrode,
            electrodeList, setElectrodeList,
            freqRange, setFreqRange,
            freqList, setFreqList,
            timeRange, setTimeRange,
            duration, setDuration,
            sharedGraph, setSharedGraph,
            chosenFile, setChosenFile,
            activeNodes, setActiveNodes,
            loading, setLoading,
            connectivityType, setConnectivityType,
            isAnimating, setIsAnimating
        }}>
            {children}
        </GlobalDataContext.Provider>
    );

};