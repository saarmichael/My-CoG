import { Slider, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getSpectrogramDataSync } from "../shared/getters";

interface SlidingBarProps {
  range: number[] | number;
  onChange: (event: Event, newValue: number[]) => void;
  keepDistance: boolean;
  toSubmit: boolean;
  onSubmit?: (val1: number, val2: number) => void;
}

const SlidingBar = (props: SlidingBarProps) => {
  // ref for input field for the lower thumb of the slider 
  const lowerThumbRef = React.useRef<HTMLInputElement>(null);
  // ref for input field for the upper thumb of the slider
  const upperThumbRef = React.useRef<HTMLInputElement>(null);

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
    if (activeThumb === 0) {
      setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
      // change the lower thumb input field value
      if (lowerThumbRef.current) {
        lowerThumbRef.current.value = Math.min(newValue[0], value[1] - minDistance).toString();
      }
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
      // change the upper thumb input field value
      if (upperThumbRef.current) {
        upperThumbRef.current.value = Math.max(newValue[1], value[0] + minDistance).toString();
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
      if (lowerThumbRef.current) {
        lowerThumbRef.current.value = Math.min(newValue[0], microSliderValue[1] - 0.001).toString();
      }
    } else {
      setMicroSliderValue([microSliderValue[0], Math.max(newValue[1], microSliderValue[0] + 0.001)]);
      // change the upper thumb input field value
      if (upperThumbRef.current) {
        upperThumbRef.current.value = Math.max(newValue[1], microSliderValue[0] + 0.001).toString();
      }
    }
  };


  const handleTooltipOpen = (event: React.MouseEvent<HTMLSpanElement>) => {

    handleHoverChange(event, value);
    // calculate hoverValue here based on event data...
    setShowMicroSlider(true);
  };
  
  const handleTooltipClose = () => {
    setTimeout(() => {
      setShowMicroSlider(false);
    }, 3000);
  };

  return (
    <>
      <Tooltip 
      open={showMicroSlider}
      
      title={<Slider
        style={{width: '25vh'}}
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
      <TextField inputRef={lowerThumbRef} defaultValue={value[0]} type="number" size="small" label={"lowerThumb"}
        onChange={(event) => {
          // set the value of the slider to the value of the input field
          setValue([Math.max(Number(event.target.value), 0), value[1]]);
        }} />
      <TextField inputRef={upperThumbRef} defaultValue={value[1]} type="number" size="small" label={"upperThumb"}
        onChange={(event) => {
          // set the value of the slider to the value of the input field  
          setValue([value[0], Math.min(Number(event.target.value), array[array.length - 1])]);
        }} />


      {props.toSubmit && <button onClick={() => {
        if (props.onSubmit) {
          props.onSubmit(Number(lowerThumbRef.current?.value), Number(upperThumbRef.current?.value));
        }
      }
      }
      >Submit</button>}
    </>
  );
};

export default SlidingBar;
