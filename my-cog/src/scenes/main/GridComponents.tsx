import { useContext } from "react";
import { GraphContainer } from "../../components/GraphContainer";
import { GridGraph } from "../../components/GridGraph";
import { SlidingBar } from "../../components/SlidingBar";
import Spectrogram from "../../components/Spectrogram";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import { getCoherenceByTime, getSpectrogramDataSync } from "../../shared/getters";
import './GridStyle.css';
import { EditablesContainer } from "../../components/EditablesContainer";
import { GraphVisToggles } from "../../components/GraphVisToggles";
import { Rnd } from "react-rnd";
import React from "react";

export interface BoxProps {
  name: string;
}

export const Box: React.FC<BoxProps> = () => {
  const data = getCoherenceByTime(0);

  const handleChange = (event: Event, newValue: number | number[]) => {
    console.log(newValue);
  };

  return (

    <>
      <GraphContainer />
    </>

  );
}

export const Box1: React.FC<BoxProps> = () => {
  const { electrode } = useContext(GlobalDataContext) as IGlobalDataContext;

  return (
    <>
      <GraphVisToggles />
      <EditablesContainer />

    </>
  )
}

export function Box2() {
  return (
    <>
      <GridGraph />
    </>
  );
}


export default Box;