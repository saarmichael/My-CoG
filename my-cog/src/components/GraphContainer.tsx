import { useContext, useEffect, useState } from "react";
import { Box, Checkbox, FormControlLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { VisGraphOptionsProvider } from "../contexts/VisualGraphOptionsContext";
import BasicGraphinGraph from "./BasicGraphinGraph";
import { DataOptions } from "./DataOptions";
import { GraphVisToggles } from "./GraphVisToggles";
import { GlobalDataContext, IGlobalDataContext } from "../contexts/ElectrodeFocusContext";
import SlidingBar from "./SlidingBar";
import { getDuration, getFrequencies } from "../shared/RequestsService";
import { getSingletonFreqList, getSingletonDuration } from "../shared/RequestsService";
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import ReactLoading from "react-loading";


export const GraphContainer = () => {

    const { state,
        freqList, setFreqList,
        setFreqRange, duration,
        setDuration,
        setTimeRange,
        activeNodes, setActiveNodes,
        loading,
    } = useContext(GlobalDataContext) as IGlobalDataContext;

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

    const handleCheckboxClick = (label: string) => {
        const activeNodesId = activeNodes.map((node) => node.id);
        const activeNodesLabel = activeNodes.map((node) => node.label);
        // if the node is already active, remove it from the active nodes list
        if (activeNodesLabel.includes(label) || activeNodesId.includes(label)) {
            setActiveNodes(activeNodes.filter((node) => node.id !== label && node.label !== label));
        } else {
            const node = state.nodes.find((node) => node.id === label || node.style?.label?.value === label);
            if (node) {
                setActiveNodes([...activeNodes, { id: node.id, label: node.style?.label?.value ? node.style.label.value : node.id }]);
            }
        }
    }


    // make a list of checkboxes to select the active nodes
    const selectActiveNodes = (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%', height: '10%' }}>


            <List sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 125,
                margin: '10px'
            }}>
                {state.nodes.map((node) => {
                    return (
                        <ListItem key={node.id} >
                            <ListItemButton role={undefined} onClick={
                                () => handleCheckboxClick(node.style?.label?.value ? node.style.label.value : node.id)}
                                dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={activeNodes.map((activeNode) => activeNode.id).includes(node.id)}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': node.id }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={node.id} primary={node.style?.label?.value ? node.style.label.value : node.id} />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </div >
    );

    const loadingGif = (
        <ReactLoading height={'10px'} width={'10px'} type="spin" color="#000000" />
    );

    return (
        <>
            <div>
                {selectActiveNodes}
            </div>
            <SlidingBar range={fList} keepDistance={false} onChange={handleFreqChange} toSubmit={false} />
            <SlidingBar range={duration} keepDistance={true} onChange={() => { }} toSubmit={timeToSubmit} onSubmit={handleDurationChange} />
            {loading ? loadingGif : <></>}
            <div>
                <BasicGraphinGraph />
            </div>

        </>
    );

};