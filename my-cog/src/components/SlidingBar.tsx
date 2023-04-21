import { Slider } from "@mui/material";
import React, { useState } from "react";
import { getSpectrogramDataSync } from "../shared/getters";

interface SlidingBarProps {
  array: number[];
  onChange: (event: Event, newValue: number | number[]) => void;
}

const SlidingBar = (props: SlidingBarProps) => {

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };
  const [value, setValue] = React.useState<number[]>([props.array[0], props.array[props.array.length - 1]]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    newValue = newValue as number[];
    newValue = newValue.map((num: number) => Math.round(num * 1000) / 1000);
    setValue(newValue);
    props.onChange(event, newValue);
  };

  return (
    <Slider
        getAriaLabel={() => 'Timeframe slider'}
        value={value}
        step={props.array[1] - props.array[0]}
        marks={props.array.map((t) => ({ value: t }))}
        onChange={handleChange}
        valueLabelDisplay="auto"
        onMouseDown={handleMouseDown}
        min={props.array[0]}
        max={props.array[props.array.length - 1]}
      />
  );
};

export default SlidingBar;
