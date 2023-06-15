import { Box, Grid, Slider, TextField } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useEffect, useRef, useState, useContext } from "react";
import { IconWrapper, useTextFieldsStyle } from "../tools_components/Styles";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import { cahceInServer } from "../../shared/RequestsService";

export const GraphAnimation = () => {
    const { duration, setTimeRange, isAnimating, setIsAnimating, overlap, samplesPerSegment, connectivityType } = useContext(GlobalDataContext) as IGlobalDataContext;
    const [start, setStart] = useState<number>(0);
    const [end, setEnd] = useState<number>(0);
    const [windowSize, setWindowSize] = useState<number>(0);
    const [currentFrameStart, setCurrentFrameStart] = useState<number>(start);
    const [showSlider, setShowSlider] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
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
        }, 1500);
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


    const preCompute = async () => {
        await cahceInServer(connectivityType, start, end, windowSize, overlap, samplesPerSegment);
    }

    useEffect(() => {
        if (currentFrameStart >= end) {
            setTimeout(() => {
                setShowSlider(false);
            }, 1000);
        }
    }, [currentFrameStart, end, windowSize]);

    const checkError = () => {
        if (start < 0 || end > duration || windowSize >= duration || windowSize <= 0 || start >= end) {
            setIsError(true);
            setTimeout(() => {
                setIsError(false);
            }, 2000);
            return true;
        } else {
            setIsError(false);
            return false;
        }
    }


    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <TextField
                        className={classes.root}
                        label={"start"}
                        value={start}
                        defaultValue={start}
                        type="number"
                        size="small"
                        disabled={isAnimating}
                        onChange={(event) => {
                            setStart(Math.max(Number(event.target.value), 0));
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        className={classes.root}
                        label={"end"}
                        sx={{ width: '100%' }}
                        value={end}
                        defaultValue={end}
                        type="number"
                        size="small"
                        disabled={isAnimating}
                        onChange={(event) => {
                            setEnd(Math.min(Number(event.target.value), duration));
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        className={classes.root}
                        label={"windowSize"}
                        inputProps={{
                            step: 0.1,
                        }}
                        value={windowSize}
                        defaultValue={windowSize}
                        type="number"
                        size="small"
                        disabled={isAnimating}
                        onChange={(event) => {
                            setWindowSize(Math.min(Number(event.target.value), duration));
                        }}
                    />
                </Grid>

                <Grid
                    item
                    xs={6} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <span
                        className={isError ? "submit-button submit-button-error" : "submit-button"}
                        style={{ width: '60%', margin: '0 auto' }}
                        onClick={() => {
                            if (!checkError()) {
                                setCurrentFrameStart(start);
                                setIsAnimating(true);
                                setShowSlider(true);
                            }
                        }}
                    >
                        {isError ? "Error" : "Start Animation"}
                    </span>
                    <span

                        onClick={async () => {
                            if (!checkError()) {
                                await preCompute();
                                setIsAnimating(true);
                            }
                        }}
                    >
                        <IconWrapper>
                            <PlayArrowIcon />
                        </IconWrapper>
                    </span>
                    <span
                        onClick={() => {
                            setIsAnimating(false);
                        }}
                    >
                        <IconWrapper>
                            <PauseIcon />
                        </IconWrapper>
                    </span>
                    { }
                </Grid>

                <Grid item xs={12}>
                    {showSlider &&
                        <Slider
                            sx={{ color: 'purple' }}
                            getAriaLabel={() => 'Animation slider'}
                            value={currentFrameStart}
                            min={start}
                            max={end}
                            onChange={handleSliderChange}
                            disabled={isAnimating}
                            valueLabelDisplay={isAnimating ? "on" : "auto"}

                        />}
                </Grid>
            </Grid>
        </>
    );
}