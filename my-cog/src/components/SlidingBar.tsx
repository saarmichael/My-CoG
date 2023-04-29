import { Slider, TextField } from "@mui/material";
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


  return (
    <>
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
      <TextField inputRef={lowerThumbRef} defaultValue={value[0]} type="number" size="small" label={"lowerThumb"}
        onChange={(event) => {
          // set the value of the slider to the value of the input field
          setValue([Number(event.target.value), value[1]]);
        }} />
      <TextField inputRef={upperThumbRef} defaultValue={value[1]} type="number" size="small" label={"upperThumb"}
        onChange={(event) => {
          // set the value of the slider to the value of the input field  
          setValue([value[0], Number(event.target.value)]);
        }} />


      {props.toSubmit && <button onClick={() => {
        if (props.onSubmit) {
          props.onSubmit(value[0], value[1]);
        }
      }
      }
      >Submit</button>}
    </>
  );
};

export default SlidingBar;
