import { Slider } from "@mui/material";
import React, { useState } from "react";
import { getSpectrogramDataSync } from "../shared/getters";

interface SlidingBarProps {
  array: number[];
  onChange: (event: Event, newValue: number[]) => void;
}

const  SlidingBar = (props: SlidingBarProps) => {

  let minDistance = 1;
  if(Array.isArray(props.array)) {
    minDistance = props.array[1] - props.array[0];
  }
  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };
  const [value, setValue] = React.useState<number[]>([props.array[0], props.array[props.array.length - 1]]);

  const handleChange = (event: Event, newValue: number | number[], activeThumb:number) => {
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
    
    <Slider
        getAriaLabel={() => 'Timeframe slider'}
        value={value}
        step={props.array[1] - props.array[0]}
        marks={true}
        onChange={handleChange}
        valueLabelDisplay="auto"
        onMouseDown={handleMouseDown}
        min={props.array[0]}
        max={props.array[props.array.length - 1]}
        disableSwap={true}
      />
  );
};

export default SlidingBar;
