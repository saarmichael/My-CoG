import { useContext, useEffect, useState } from "react";
import { VisGraphOptionsProvider } from "../contexts/VisualGraphOptionsContext";
import BasicGraphinGraph from "./BasicGraphinGraph";
import { DataOptions } from "./DataOptions";
import { GraphVisToggles } from "./GraphVisToggles";
import { GlobalDataContext, IElectrodeFocusContext } from "../contexts/ElectrodeFocusContext";
import SlidingBar from "./SlidingBar";
import { getSingletonFreqList, getSingletonDuration } from "../shared/RequestsService";


export const GraphContainer = () => {

    const { freqList, setFreqList, setFreqRange, duration, setDuration } = useContext(GlobalDataContext) as IElectrodeFocusContext;

    const handleFreqChange = (event: Event, newValue: number[]) => {
        setFreqRange({ min: newValue[0], max: newValue[1] })
    }

    const [fList, setFList] = useState<number[]>([0, 1]);

    useEffect(() => {
        const getFrequencyAndTime = async () => {
            let frequencyListAsync = await getSingletonFreqList();
            let durationAsync = await getSingletonDuration();
            return { frequencyListAsync, durationAsync };
        }
        getFrequencyAndTime().then((data) => {
            setFreqList(data.frequencyListAsync);
            setDuration(data.durationAsync);
        });
    }, []);

    useEffect(() => {
        setFList(freqList);
    }, [freqList]);

    return (
        <>
            <SlidingBar array={fList} onChange={handleFreqChange} />
            <BasicGraphinGraph />
        </>
    );

};