import { useContext, useEffect, useRef, useState } from "react";
import { Box, Checkbox, Grid, TextField, Slider } from '@mui/material';
import BasicGraphinGraph from "./BasicGraphinGraph";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import { SlidingBar } from "../tools_components/SlidingBar";
import { getConnectivityMeasuresList, getDuration, getFrequencies } from "../../shared/RequestsService";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDropdownStyles } from "../tools_components//Styles";
import CircularProgress from '@mui/material/CircularProgress';
import { useTextFieldsStyle } from "../../components/tools_components/Styles";
import { TimeInterval } from "../../shared/GraphRelated";


export const GraphContainer = () => {

    const { state,
        freqList, setFreqList,
        setFreqRange, duration,
        setDuration,
        setTimeRange,
        activeNodes, setActiveNodes,
        loading,
        setConnectivityType, connectivityType,
        isAnimating, setIsAnimating,
        overlap, setOverlap,
        samplesPerSegment, setSamplesPerSegment,
    } = useContext(GlobalDataContext) as IGlobalDataContext;

    const [sliderDuration, setSliderDuration] = useState<TimeInterval>({
        resolution: 's',
        start: 0,
        end: 0,
        samplesPerSegment: samplesPerSegment,
        overlap: overlap
    });

    const handleFreqChange = (event: Event, newValue: number[] | number) => {
        newValue = newValue as number[];
        setFreqRange({ min: newValue[0], max: newValue[1] })
    }

    const handleDurationChange = (event: Event, newValue: number[] | number) => {
        newValue = newValue as number[];
        setSliderDuration({
            resolution: 's', start: newValue[0], end: newValue[1],
            samplesPerSegment: samplesPerSegment, overlap: overlap
        })
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

    const dpClasses = useDropdownStyles();
    const tfClasses = useTextFieldsStyle();

    const selectConnectivity = (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth >
                <InputLabel shrink id="connectivity-select-label">Connectivity</InputLabel>
                <Select
                    className={dpClasses.customDropdown}
                    labelId="connectivity-select-label"
                    id="connectivity-select"
                    value={connectivityType}
                    label="Connectivity type"
                    disabled={isAnimating}
                    onChange={(e) => {
                        setConnectivityType(e.target.value);
                    }}
                    style={{ width: '15vh', fontSize: '0.8em' }}
                >
                    {connectivityMeasuresList.map((measure) => (
                        <MenuItem key={measure} value={measure}>{measure}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );

    // asd

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


            <Grid container spacing={3}>

                <Grid item xs={5} className="verticalLine">

                    <SlidingBar
                        sliderName="Frequency slider"
                        range={fList}
                        keepDistance={false}
                        onChange={handleFreqChange}
                        miniSlider={false}
                        disabled={isAnimating}
                    />

                </Grid>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={5} justifyContent="center">
                    <SlidingBar sliderName="Time slider" range={duration} keepDistance={true}
                        onChange={handleDurationChange}
                        miniSlider={true}
                        disabled={isAnimating}
                    />
                </Grid>
                <Grid item xs={5}>
                    <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField
                            className={tfClasses.root}
                            sx={{ width: '100%' }}
                            value={samplesPerSegment}
                            type="number"
                            size="small"
                            label={"nprseg"}
                            onChange={(event) => {
                                const value = parseFloat(event.target.value);
                                if (!isNaN(value)) {
                                    setSamplesPerSegment(value);
                                }
                            }}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            className={tfClasses.root}
                            sx={{ width: '100%' }}
                            value={overlap}
                            type="number"
                            size="small"
                            label={"nprseg"}
                            onChange={(event) => {
                                const value = parseFloat(event.target.value);
                                if (!isNaN(value)) {
                                    setOverlap(value);
                                }
                            }}
                        />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={2.5}>
                    {selectConnectivity}
                </Grid>
                <Grid item xs={2.5} style={{display: 'flex'}}>
                    <div
                        className="submit-button"
                        style={{  
                            padding: '10px', 
                            overflow: 'hidden', 
                            width: '200px', 
                            textAlign: 'center',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                        onClick={() => {
                            setTimeRange(sliderDuration);
                        }}
                    >
                        {loading ? <CircularProgress size={15} sx={{ color: "white" }} /> : <>Get {connectivityType}</>}
                    </div>
                </Grid>
            </Grid>
        </>
    );

};