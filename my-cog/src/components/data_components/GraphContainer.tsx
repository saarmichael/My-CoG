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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { TimeInterval } from "../../shared/GraphRelated";
import { NodeSelection } from "../tools_components/NodeSelection";


const GraphAnimation = () => {
    const { duration, setTimeRange, isAnimating, setIsAnimating, overlap, samplesPerSegment } = useContext(GlobalDataContext) as IGlobalDataContext;
    const [start, setStart] = useState<number>(0);
    const [end, setEnd] = useState<number>(0);
    const [windowSize, setWindowSize] = useState<number>(0);
    const [currentFrameStart, setCurrentFrameStart] = useState<number>(start);
    const isAnimatingRef = useRef<boolean>(isAnimating);
    const currentFrameStartRef = useRef<number>(currentFrameStart);


    const classes = useTextFieldsStyle();


    const animate = () => {
        let currentEndFrame = currentFrameStartRef.current + windowSize;
        const intervalId = setInterval(() => {
            if (currentEndFrame > end || !isAnimatingRef.current) {
                if (currentEndFrame > end) {
                    setCurrentFrameStart(start);
                    setIsAnimating(false);
                    isAnimatingRef.current = false;
                }
                clearInterval(intervalId);
                return;
            }
            setTimeRange({ resolution: 's', start: currentFrameStartRef.current, end: currentEndFrame, samplesPerSegment: samplesPerSegment, overlap: overlap });
            setCurrentFrameStart(prevFrameStart => prevFrameStart + windowSize);
            currentEndFrame += windowSize;
        }, 1000);
    };

    useEffect(() => {
        isAnimatingRef.current = isAnimating;
        if (isAnimating) {
            animate();
        }
    }, [isAnimating])

    useEffect(() => {
        currentFrameStartRef.current = currentFrameStart;
    }, [currentFrameStart]);


    const handleSliderChange = (event: any, value: number | number[]) => {
        setCurrentFrameStart(value as number);
    };


    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        className={classes.root}
                        sx={{ width: '100%' }}
                        value={start}
                        defaultValue={start}
                        type="number"
                        size="small"
                        label={"start"}
                        disabled={isAnimating}
                        onChange={(event) => {
                            setStart(Math.max(Number(event.target.value), 0));
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField

                        className={classes.root}
                        sx={{ width: '100%' }}
                        value={end}
                        defaultValue={end}
                        type="number"
                        size="small"
                        label={"end"}
                        disabled={isAnimating}
                        onChange={(event) => {
                            setEnd(Math.min(Number(event.target.value), duration));
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        className={classes.root}
                        sx={{ width: '100%' }}
                        value={windowSize}
                        defaultValue={windowSize}
                        type="number"
                        size="small"
                        label={"windowSize"}
                        disabled={isAnimating}
                        onChange={(event) => {
                            setWindowSize(Math.min(Number(event.target.value), duration));
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Slider
                        sx={{ color: 'purple' }}
                        getAriaLabel={() => 'Animation slider'}
                        value={currentFrameStart}
                        min={start}
                        max={end}
                        onChange={handleSliderChange}
                        disabled={isAnimating}
                    />
                </Grid>
                <Grid item xs={6}>
                    {<div
                        className="start-animation-button"
                        style={{ width: '40%', margin: '0 auto' }}
                        onClick={() => {
                            setCurrentFrameStart(start);
                            setIsAnimating(true);
                        }}
                    >
                        Start Animation
                    </div>}
                </Grid>
                <Grid item xs={6}>
                    {<div
                        className="pause-animation-button"
                        style={{ width: '40%', margin: '0 auto' }}
                        onClick={() => {
                            setIsAnimating(false);
                        }}
                    >
                        <PauseIcon />
                    </div>}
                </Grid>
                <Grid item xs={6}>
                    {<div
                        className="play-animation-button"
                        style={{ width: '40%', margin: '0 auto' }}
                        onClick={() => {
                            setIsAnimating(true);
                        }}
                    >
                        <PlayArrowIcon />
                    </div>}
                </Grid>
            </Grid>
        </>
    );
}


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
    

    const dpClasses = useDropdownStyles();
    const tfClasses = useTextFieldsStyle();

    const selectConnectivity = (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth style={{ marginTop: '20px' }}>
                <Select
                    className={dpClasses.customDropdown}
                    labelId="connectivity-select-label"
                    id="connectivity-select"
                    label={"Connectivity"}
                    value={connectivityType}
                    disabled={isAnimating}
                    onChange={(e) => {
                        setConnectivityType(e.target.value);
                    }}
                    style={{ width: '18vh' }}
                >
                    {connectivityMeasuresList.map((measure) => (
                        <MenuItem key={measure} value={measure}>
                            {measure}
                        </MenuItem>
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
                    <NodeSelection state={state} nodesList={activeNodes}
                        onClick={handleCheckboxClick} />
                </Grid>
            </Grid>


            <Grid container spacing={4}>
                <Grid item xs={5}>
                    <SlidingBar sliderName="Frequency slider" range={fList} keepDistance={false}
                        onChange={handleFreqChange}
                        miniSlider={false}
                        disabled={isAnimating}
                    />
                </Grid>
                <Grid item xs={5} justifyContent="center">
                    <SlidingBar sliderName="Time slider" range={duration} keepDistance={true}
                        onChange={handleDurationChange}
                        miniSlider={true}
                        disabled={isAnimating}
                    />
                    <Box display="flex" justifyContent="center" alignItems="center" marginTop="2px">
                        <Box>
                            {loading ? <CircularProgress size={20} sx={{ color: "purple" }} /> : null}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={2}>
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
                <Grid item xs={12}>
                    {<div
                        className="submit-button"
                        style={{ width: '40%', margin: '0 auto' }}
                        onClick={() => {
                            setTimeRange(sliderDuration);
                        }}
                    >
                        Submit
                    </div>}
                </Grid>
                <Grid item xs={2}>
                    <GraphAnimation />
                </Grid>
                <Grid item xs={2}>
                    {selectConnectivity}
                </Grid>
            </Grid>
        </>
    );

};