import { Box, Grid, Slider, TextField } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useEffect, useRef, useState, useContext } from "react";
import { IconWrapper, useTextFieldsStyle } from "../tools_components/Styles";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";

export const GraphAnimation = () => {
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
                <Grid item xs={2}>
                    <TextField
                        className={classes.root}
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
                <Grid item xs={2}>
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
                <Grid item xs={2}>
                    <TextField
                        className={classes.root}

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

                <Grid
                    item
                    xs={6} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <span
                        className="submit-button"
                        style={{ width: '60%', margin: '0 auto' }}
                        onClick={() => {
                            setCurrentFrameStart(start);
                            setIsAnimating(true);
                        }}
                    >
                        Start Animation
                    </span>
                    <span
                        onClick={() => {
                            setIsAnimating(true);
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
            </Grid>
        </>
    );
}