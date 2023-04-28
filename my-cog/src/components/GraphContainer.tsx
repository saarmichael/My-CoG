import { useContext, useEffect, useState } from "react";
import { VisGraphOptionsProvider } from "../contexts/VisualGraphOptionsContext";
import BasicGraphinGraph from "./BasicGraphinGraph";
import { DataOptions } from "./DataOptions";
import { GraphVisToggles } from "./GraphVisToggles";
import { GlobalDataContext, IElectrodeFocusContext } from "../contexts/ElectrodeFocusContext";
import SlidingBar from "./SlidingBar";
import { getSingletonFreqList, getSingletonDuration } from "../shared/RequestsService";


export const GraphContainer = () => {

    const { freqList, setFreqList, setFreqRange, duration, setDuration, setTimeRange } = useContext(GlobalDataContext) as IElectrodeFocusContext;

    const handleFreqChange = (event: Event, newValue: number[]) => {
        setFreqRange({ min: newValue[0], max: newValue[1] })
    }

    const handleDurationChange = (val1: number, val2: number) => {
        setTimeRange({ resolution: 's', start: val1, end: val2 })
    }

    const [fList, setFList] = useState<number[]>([0, 1]);
    const [timeToSubmit, setTimeToSubmit] = useState<boolean>(false);

    useEffect(() => {
        console.log("GraphContainer: useEffect: getFrequencyAndTime");
        const getFrequencyAndTime = async () => {
            let frequencyListAsync = await getSingletonFreqList();
            let durationAsync = await getSingletonDuration();
            return { frequencyListAsync, durationAsync };
        }
        getFrequencyAndTime().then((data) => {
            setFreqList(data.frequencyListAsync);
            setDuration(data.durationAsync);
            setTimeToSubmit(true);
        });
    }, []);

    useEffect(() => {
        setFList(freqList);
    }, [freqList]);

    useEffect(() => {
        setTimeRange({ resolution: 's', start: 0, end: duration });
    }, [duration]);

    return (
        <>
            <SlidingBar range={fList} onChange={handleFreqChange} toSubmit={false} />
            <SlidingBar range={duration} onChange={() => { }} toSubmit={timeToSubmit} onSubmit={handleDurationChange} />
            <BasicGraphinGraph />
        </>
    );

};