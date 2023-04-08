import { Slider } from "@mui/material";
import React, { useState } from "react";
import { getSpectrogramDataSync } from "../shared/getters";

interface SlidingBarProps {
  start: number;
  end: number;
  min: number;
  max: number;
  step?: number;
  onChange: (start: number, end: number) => void;
}

const SlidingBar: React.FC<SlidingBarProps> = () => {

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };
  const data = getSpectrogramDataSync(0)
  const [value, setValue] = React.useState<number[]>([data.t[0], data.t[data.t.length - 1]]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    newValue = newValue as number[];
    newValue = newValue.map((num: number) => Math.round(num * 1000) / 1000);
    setValue(newValue);
  };

  return (
    <Slider
        getAriaLabel={() => 'Timeframe slider'}
        value={value}
        step={data.t[1] - data.t[0]}
        marks={data.t.map((t) => ({ value: t }))}
        onChange={handleChange}
        valueLabelDisplay="auto"
        onMouseDown={handleMouseDown}
        min={data.t[0]}
        max={data.t[data.t.length - 1]}
      />
  );
};

export default SlidingBar;
