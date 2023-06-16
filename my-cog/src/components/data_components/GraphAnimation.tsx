import { Box, Grid, Slider, TextField } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useEffect, useRef, useState, useContext } from "react";
import { IconWrapper, useTextFieldsStyle } from "../tools_components/Styles";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import { cahceInServer } from "../../shared/RequestsService";
import StopIcon from '@mui/icons-material/Stop';

export const GraphAnimation = () => {
    const { duration, setTimeRange, isAnimating, setIsAnimating, overlap, samplesPerSegment, connectivityType } = useContext(GlobalDataContext) as IGlobalDataContext;
    const [start, setStart] = useState<number>(0);
    const [end, setEnd] = useState<number>(0);
    const [windowSize, setWindowSize] = useState<number>(0.5);
    const [currentFrameStart, setCurrentFrameStart] = useState<number>(start);
    const [showSlider, setShowSlider] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [aborted, setAborted] = useState<boolean>(false);
    const [buttonClass, setButtonClass] = useState<string>("submit-button");
    const [buttonText, setButtonText] = useState<string>("Start Animation");
    const isAnimatingRef = useRef<boolean>(isAnimating);
    const currentFrameStartRef = useRef<number>(currentFrameStart);
    const isLoadingRef = useRef<boolean>(isLoading);
    const isAbortedRef = useRef<boolean>(aborted);


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

    useEffect(() => {
        if (isError) {
            setButtonClass("submit-button submit-button-error");
            setButtonText("Error!");
        } else if (isLoading) {
            setButtonClass("submit-button submit-button-loading");
        } else if (isAnimating) {
            setButtonClass("submit-button submit-button-animating");
            setButtonText("Animating...");
        } else {
            setButtonClass("submit-button");
            setButtonText("Start Animation");
        }
    }, [isError, isLoading, isAnimating]);

    const loadingTexts = ["Preparing 🍳", "Preparing 🧙‍♂️", "Preparing 🎰", "Caching Data 🔢", "Be Patient 😎"]
    useEffect(() => {
        // generate different texts for loading stage
        if (isLoading) {
            // generate random number between 0 and 4 and set the text untill isLoding is false
            const intervalId = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * loadingTexts.length);
                setButtonText(loadingTexts[randomIndex]);
            }, 1000);
            return () => clearInterval(intervalId);

        }
    }, [isLoading]);



    const handleSliderChange = (event: any, value: number | number[]) => {
        setCurrentFrameStart(value as number);
    };


    const preCompute = async () => {
        setIsLoading(true);
        isLoadingRef.current = true;
        await cahceInServer(connectivityType, start, end, windowSize, overlap, samplesPerSegment);
        if (isAbortedRef.current) {
            setAborted(false);
            isAbortedRef.current = false;
        } else {
            setCurrentFrameStart(start);
            setIsAnimating(true);
            isAnimatingRef.current = true;
            setShowSlider(true);
        }
        setIsLoading(false);
        isLoadingRef.current = false;
    }

    useEffect(() => {
        if (currentFrameStart >= end) {
            setTimeout(() => {
                setShowSlider(false);
            }, 1000);
        }
    }, [currentFrameStart, end, windowSize]);

    const checkError = () => {
        if (start < 0 || end > duration || windowSize >= (end - start) || windowSize <= 0 || start >= end) {
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
                        type="number"
                        size="small"
                        disabled={isAnimating}
                        value={start}
                        onChange={(event) => {
                            setStart(Math.max(Number(event.target.value), 0));
                        }}
                        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                            event.target.value = Number(event.target.value).toString();
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        className={classes.root}
                        label={"end"}
                        sx={{ width: '100%' }}
                        type="number"
                        size="small"
                        disabled={isAnimating}
                        value={end}
                        onChange={(event) => {
                            let dur = Number(duration.toFixed(2));
                            setEnd(Math.min(Number(event.target.value), dur));
                        }}
                        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                            event.target.value = Number(event.target.value).toString();
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
                        type="number"
                        size="small"
                        disabled={isAnimating}
                        onChange={(event) => {
                            let dur = Number(duration.toFixed(2));
                            setWindowSize(Math.min(Number(event.target.value), dur));
                        }}
                    />
                </Grid>

                <Grid
                    item
                    xs={6} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <span
                        className={buttonClass ? buttonClass : "submit-button"}
                        style={{ width: '60%', margin: '0 auto' }}
                        onClick={async () => {
                            if (!checkError()) {
                                if (isAbortedRef.current) {
                                    setAborted(false);
                                    isAbortedRef.current = false;
                                }
                                await preCompute();
                            }
                        }}
                    >
                        {buttonText}
                    </span>
                    <span

                        onClick={() => {
                            if (!checkError()) {
                                setIsAnimating(true);
                                isAnimatingRef.current = true;
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
                            isAnimatingRef.current = false;
                        }}
                    >
                        <IconWrapper>
                            <PauseIcon />
                        </IconWrapper>
                    </span>
                    <span
                        onClick={() => {
                            setAborted(true);
                            isAbortedRef.current = true;
                            setIsAnimating(false);
                            isAnimatingRef.current = false;
                            setShowSlider(false);
                            setIsLoading(false);
                            isLoadingRef.current = false;
                            setStart(0);
                            setCurrentFrameStart(0);
                        }}
                    >
                        <IconWrapper>
                            <StopIcon />
                        </IconWrapper>
                    </span>
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