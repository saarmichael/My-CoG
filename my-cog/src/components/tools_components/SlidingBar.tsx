import { Button, Grid, Slider, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useTextFieldsStyle } from "../../components/tools_components/Styles";

interface SlidingBarProps {
  sliderName: string;
  range: number[] | number;
  onChange: ((event: Event, newValue: number[] | number) => void)
  keepDistance: boolean;
  toSubmit: boolean;
  onSubmit?: (val1: number, val2: number) => void;
  miniSlider: boolean;
}



export const SlidingBarOneTumb = (props: SlidingBarProps) => {

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  const [value, setValue] = React.useState<number>(0);

  useEffect(() => {
    props.onChange(new Event('change'), value);
  }, [value]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Slider
      sx={{ color: 'purple' }}
      getAriaLabel={() => 'Timeframe slider'}
      value={value}
      onChange={handleChange}
      valueLabelDisplay="auto"
      onMouseDown={handleMouseDown}
      min={0}
      max={props.range as number}
      disableSwap={true}
    />
  );
};

export const SlidingBar = (props: SlidingBarProps) => {

  const [lockThumbs, setLockThumbs] = useState<boolean>(false);

  const classes = useTextFieldsStyle();

  let minDistance = 0;
  let array: number[] = [];
  if (Array.isArray(props.range)) {
    if (props.keepDistance)
      minDistance = props.range[1] - props.range[0];
    array = props.range;
  } else {
    // fill the array with values from 0 to duration with step 1
    for (let i = 0; i < props.range; i++) {
      array.push(i);
    }
    if (props.keepDistance)
      minDistance = 1;
  }
  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };
  const [value, setValue] = React.useState<number[]>([array[0], array[array.length - 1]]);

  const handleChange = (event: Event, newValue: number | number[], activeThumb: number) => {
    newValue = newValue as number[];
    newValue = newValue.map((num: number) => Math.round(num * 1000) / 1000);
    if (lockThumbs) {
      if (value[0] === array[0]) {
        if (newValue[1] < value[1]) {
          return;
        }
      }
      if (value[1] === array[array.length - 1]) {
        if (newValue[0] > value[0]) {
          return;
        }
      }
    }

    const [lowerThumb, upperThumb] = value; // Destructure the current values of the thumbs

    if (activeThumb === 0) {
      if (lockThumbs) {
        const stepSize = newValue[0] - lowerThumb; // Use current value as reference
        const newUpperThumb = upperThumb + stepSize;
        const maxUpperThumb = array[array.length - 1];

        setValue([
          Math.min(newValue[0], maxUpperThumb - minDistance), // Adjust lower thumb within limits
          Math.min(newUpperThumb, maxUpperThumb) // Adjust upper thumb within limits
        ]);
      } else {
        setValue([Math.min(newValue[0], upperThumb - minDistance), upperThumb]);
      }
    } else {
      if (lockThumbs) {
        const stepSize = newValue[1] - upperThumb; // Use current value as reference
        const newLowerThumb = lowerThumb + stepSize;
        const minLowerThumb = array[0];

        setValue([
          Math.max(newLowerThumb, minLowerThumb), // Adjust lower thumb within limits
          Math.max(newValue[1], minLowerThumb + minDistance) // Adjust upper thumb within limits
        ]);
      } else {
        setValue([lowerThumb, Math.max(newValue[1], lowerThumb + minDistance)]);
      }
    }
  };


  useEffect(() => {
    props.onChange(new Event('change'), value);
  }, [value]);

  // micro slider

  const [showMicroSlider, setShowMicroSlider] = useState<boolean>(false);
  const [hoverValue, setHoverValue] = React.useState<number[]>([0, 1]);
  const [microSliderValue, setMicroSliderValue] = React.useState<number[]>([0, 1]);
  const [hoverTooltipOpen, setHoverTooltipOpen] = React.useState<boolean>(false);

  const handleHoverChange = (event: any, newValue: number | number[]) => {
    newValue = newValue as number[];
    setHoverValue([Math.floor(newValue[0]), Math.floor(newValue[0]) + 2]); // get the floor value to define a range for micro slider
    setShowMicroSlider(true); // show the micro slider when user moves the thumb
  };

  const handleMicroSliderChange = (event: any, newValue: number | number[], activeThumb: number) => {
    newValue = newValue as number[];
    newValue = newValue.map((num: number) => Math.round(num * 1000) / 1000);
    if (activeThumb === 0) {
      setMicroSliderValue([Math.min(newValue[0], microSliderValue[1] - 0.001), microSliderValue[1]]);
      // change the lower thumb input field value
      setValue([Math.min(newValue[0], microSliderValue[1] - 0.001), microSliderValue[1]]);

    } else {
      setMicroSliderValue([microSliderValue[0], Math.max(newValue[1], microSliderValue[0] + 0.001)]);
      // change the upper thumb input field value
      setValue([microSliderValue[0], Math.max(newValue[1], microSliderValue[0] + 0.001)]);
    }
  };

  const handleTooltipHoverOpen = (event: React.MouseEvent<HTMLSpanElement>) => {
    setHoverTooltipOpen(true);
  };

  const handleTooltipHoverClose = () => {
    setHoverTooltipOpen(false);
  };


  const handleTooltipOpen = (event: React.MouseEvent<HTMLSpanElement>) => {

    handleHoverChange(event, value);
    // calculate hoverValue here based on event data...
    setShowMicroSlider(true);
  };

  const handleTooltipClose = () => {
    setTimeout(() => {
      setShowMicroSlider(false);
    }, 1000);
  };

  return (
    <>
      <span>{props.sliderName}</span>
      <Button onClick={() => {
        setLockThumbs(!lockThumbs);
      }}>
        {lockThumbs ? <LockIcon sx={{ color: 'purple' }} /> : <LockOpenIcon sx={{ color: 'purple' }} />}
      </Button>
      <Tooltip
        open={(showMicroSlider || hoverTooltipOpen) && props.miniSlider}
        title={<Slider
          sx={{ color: 'purple' }}
          onMouseEnter={handleTooltipHoverOpen}
          onMouseLeave={handleTooltipHoverClose}
          style={{ width: '25vh' }}
          value={microSliderValue}
          onChange={handleMicroSliderChange}
          onMouseDown={handleMouseDown}
          min={hoverValue[0]}
          max={hoverValue[1]}
          step={0.001}
          valueLabelDisplay="auto"
        />} arrow>
        <span style={{ width: '100%' }} onMouseOver={handleTooltipOpen} onMouseLeave={handleTooltipClose}>
          <Slider
            sx={{ color: 'purple' }}
            getAriaLabel={() => 'Timeframe slider'}
            value={value}
            step={array[1] - array[0]}
            marks={true}
            onChange={handleChange}
            valueLabelDisplay="auto"
            onMouseDown={handleMouseDown}
            min={array[0]}
            max={array[array.length - 1]}
            disableSwap={true}
          />
        </span>
      </Tooltip>


      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={6}>
          <TextField
            className={classes.root}
            sx={{ width: '100%' }}
            value={value[0]}
            defaultValue={value[0]}
            type="number"
            size="small"
            label={"lowerThumb"}
            onChange={(event) => {
              setValue([Math.max(Number(event.target.value), 0), value[1]]);
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            className={classes.root}
            sx={{ width: '100%' }}
            value={value[1]}
            defaultValue={value[1]}
            type="number"
            size="small"
            label={"upperThumb"}
            onChange={(event) => {
              setValue([value[0], Math.min(Number(event.target.value), array[array.length - 1])]);
            }}
          />
        </Grid>

        <Grid item xs={12}>
          {props.toSubmit &&
            <div
              className="submit-button"
              style={{ width: '40%', margin: '0 auto' }}
              onClick={() => {
                if (props.onSubmit) {
                  props.onSubmit(value[0], value[1]);
                }
              }}
            >
              Submit
            </div>}
        </Grid>
      </Grid>


    </>
  );
};

