import { useContext, useEffect, useState } from "react";
import { VisGraphOptionsProvider } from "../contexts/VisualGraphOptionsContext";
import BasicGraphinGraph from "./BasicGraphinGraph";
import { DataOptions } from "./DataOptions";
import { GraphVisToggles } from "./GraphVisToggles";
import { GlobalDataContext, IGlobalDataContext } from "../contexts/ElectrodeFocusContext";
import SlidingBar from "./SlidingBar";
import { getDuration, getFrequencies } from "../shared/RequestsService";


export const GraphContainer = () => {

    const { freqList, setFreqList, setFreqRange, duration, setDuration,timeRange ,setTimeRange } = useContext(GlobalDataContext) as IGlobalDataContext;

    const handleFreqChange = (event: Event, newValue: number[]) => {
        setFreqRange({ min: newValue[0], max: newValue[1] })
    }

    const handleDurationChange = (val1: number, val2: number) => {
        setTimeRange({ resolution: 's', start: val1, end: val2 })
    }

    const [fList, setFList] = useState<number[]>([0, 5]);
    const [timeToSubmit, setTimeToSubmit] = useState<boolean>(false);

    useEffect(() => {
        console.log("GraphContainer: useEffect: getFrequencyAndTime");
        const getFrequencyAndTime = async () => {
            let frequencyListAsync = await getFrequencies();;
            let durationAsync = await getDuration();
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


    return (
        <>
            <SlidingBar range={fList} keepDistance={false} onChange={handleFreqChange} toSubmit={false} />
            <SlidingBar range={duration} keepDistance={true} onChange={() => { }} toSubmit={timeToSubmit} onSubmit={handleDurationChange} />
            <BasicGraphinGraph />
        </>
    );

};