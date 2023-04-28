import { Slider } from "@mui/material";
import React, { useState } from "react";
import { getSpectrogramDataSync } from "../shared/getters";

interface SlidingBarProps {
  range: number[] | number;
  onChange: (event: Event, newValue: number[]) => void;
  toSubmit: boolean;
  onSubmit?: (val1: number, val2: number) => void;
}

const SlidingBar = (props: SlidingBarProps) => {

  let minDistance = 1;
  let array: number[] = [];
  if (Array.isArray(props.range)) {
    minDistance = props.range[1] - props.range[0];
    array = props.range;
  } else {
    // fill the array with values from 0 to duration with step 1
    for (let i = 0; i < props.range; i++) {
      array.push(i);
    }
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
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
    }
    props.onChange(event, newValue);
  };

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
