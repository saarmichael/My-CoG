import { useContext, useEffect, useState } from "react";
import { Box, Checkbox, FormControlLabel, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { VisGraphOptionsProvider } from "../contexts/VisualGraphOptionsContext";
import BasicGraphinGraph from "./BasicGraphinGraph";
import { DataOptions } from "./DataOptions";
import { GraphVisToggles } from "./GraphVisToggles";
import { GlobalDataContext, IGlobalDataContext } from "../contexts/ElectrodeFocusContext";
import SlidingBar from "./SlidingBar";
import { getConnectivityMeasuresList, getDuration, getFrequencies } from "../shared/RequestsService";
import { getSingletonFreqList, getSingletonDuration } from "../shared/RequestsService";
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import ReactLoading from "react-loading";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import { maxHeight } from "@mui/system";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


export const GraphContainer = () => {

    const { state,
        freqList, setFreqList,
        setFreqRange, duration,
        setDuration,
        setTimeRange,
        activeNodes, setActiveNodes,
        loading,
        setConnectivityType, connectivityType,
    } = useContext(GlobalDataContext) as IGlobalDataContext;

    const handleFreqChange = (event: Event, newValue: number[]) => {
        setFreqRange({ min: newValue[0], max: newValue[1] })
    }

    const handleDurationChange = (val1: number, val2: number) => {
        setTimeRange({ resolution: 's', start: val1, end: val2 })
    }

    const [fList, setFList] = useState<number[]>([0, 5]);
    const [timeToSubmit, setTimeToSubmit] = useState<boolean>(false);
    const [connectivityMeasuresList, setConnectivityMeasuresList] = useState<string[]>([]);

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
        getConnectivityMeasuresList().then((list) => {
            setConnectivityMeasuresList(list);
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
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',  // disable wrapping
            overflowY: 'auto',  // enable horizontal scroll
            overflowX: 'hidden',
            alignItems: 'center',
            maxHeight: '600px'
        }}>
            {state.nodes.map((node) => (
                <div key={node.id} onClick={() => handleCheckboxClick(node.style?.label?.value ? node.style.label.value : node.id)}>
                    <Checkbox
                        style={{ transform: 'scale(0.8)', color: 'purple' }}
                        icon={<CheckCircleOutlineIcon />}
                        checkedIcon={<CheckCircleIcon />}
                        checked={activeNodes.map((activeNode) => activeNode.id).includes(node.id)}
                        inputProps={{ 'aria-labelledby': node.id }}
                    />
                    <Typography variant="body2" align="center" style={{ fontSize: '0.65em' }}>
                        {node.style?.label?.value ? node.style.label.value : node.id}
                    </Typography>
                </div>
            ))}
        </Box>

    );

    const loadingGif = (
        <ReactLoading height={'10px'} width={'10px'} type="spin" color="#000000" />
    );

    const selectConnectivity = (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="connectivity-select-label">Connectivity</InputLabel>
                <Select
                    labelId="connectivity-select-label"
                    id="connectivity-select"
                    value={connectivityType}
                    label="Connectivity type"
                    onChange={(e) => {
                        setConnectivityType(e.target.value);
                    }}
                >
                    {connectivityMeasuresList.map((measure) => (
                        <MenuItem key={measure} value={measure}>{measure}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );

  

    return (
        <>
            <h1 className="head">Connectivity Graph</h1>
            <Grid container maxHeight="650px">
                <Grid item xs={11}>
                    <BasicGraphinGraph />
                </Grid>
                <Grid item xs={1}>
                    {selectActiveNodes}
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <SlidingBar sliderName="Frequency slider" range={fList} keepDistance={false} onChange={handleFreqChange} toSubmit={false} miniSlider={false} />
                </Grid>
                <Grid item xs={6}>
                    <SlidingBar sliderName="Time slider" range={duration} keepDistance={true}
                        onChange={() => { }}
                        toSubmit={timeToSubmit}
                        onSubmit={handleDurationChange}
                        miniSlider={true}
                    />
                    {loading ? loadingGif : null}
                </Grid>
                <Grid item xs={3}>
                    {selectConnectivity}
                </Grid>
            </Grid>
        </>
    );

};