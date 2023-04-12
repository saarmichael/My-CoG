import { Slider } from "@mui/material";
import React, { useState } from "react";
import { getSpectrogramDataSync } from "../shared/getters";

interface SlidingBarProps {
  time: number[];
  onChange: (event: Event, newValue: number | number[]) => void;
}

const SlidingBar = (props: SlidingBarProps) => {

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };
  const [value, setValue] = React.useState<number[]>([props.time[0], props.time[props.time.length - 1]]);

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
        step={props.time[1] - props.time[0]}
        marks={props.time.map((t) => ({ value: t }))}
        onChange={handleChange}
        valueLabelDisplay="auto"
        onMouseDown={handleMouseDown}
        min={props.time[0]}
        max={props.time[props.time.length - 1]}
      />
  );
};

export default SlidingBar;
