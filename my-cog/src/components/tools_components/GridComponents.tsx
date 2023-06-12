import { useContext } from "react";
import { GraphContainer } from "../../components/data_components/GraphContainer";
import { GridGraph } from "../../components/data_components/GridGraph";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import { getCoherenceByTime, getSpectrogramDataSync } from "../../shared/getters";
import './GridStyle.css';
import { EditablesContainer } from "../../components/data_components/EditablesContainer";
import { GraphVisToggles } from "../../components/data_components/GraphVisToggles";
import React from "react";
import TimeSeries from "../data_components/TimeSeries";

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
      <TimeSeries />
    </>
  );
}


export default Box;