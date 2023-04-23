import { useContext } from "react";
import { VisGraphOptionsProvider } from "../contexts/VisualGraphOptionsContext";
import BasicGraphinGraph from "./BasicGraphinGraph";
import { DataOptions } from "./DataOptions";
import { GraphVisToggles } from "./GraphVisToggles";
import { GlobalDataContext, IElectrodeFocusContext } from "../contexts/ElectrodeFocusContext";
import SlidingBar from "./SlidingBar";


export const GraphContainer = () => {

    const {freqRange, setFreqRange, timeRange, setTimeRange} = useContext(GlobalDataContext) as IElectrodeFocusContext;
    
    return (
        <>
            
            <BasicGraphinGraph />
        </>
    );

};