import { useContext, useState } from "react";
import Basic3DSpectogram from "../../components/Basic3DSpectogram";
import BasicGraphinGraph from "../../components/BasicGraphinGraph";
import DataContainer from "../../components/DataContainer";
import { BasicHeatMap } from "../../components/BasicHeatMap";
import Spectrogram from "../../components/Spectrogram";
import { ElectrodeFocusContext, IElectrodeFocusContext } from "../../contexts/ElectrodeFocusContext";
import './GridStyle.css';
import { GraphContainer } from "../../components/GraphContainer";
import { GraphVisToggles } from "../../components/GraphVisToggles";
import SlidingBar from "../../components/SlidingBar";
import { getCoherenceByTime, getSpectrogramDataSync } from "../../shared/getters";
import React from "react";

export function Box() {
  const data = getCoherenceByTime(0);

  const handleChange = (event: Event, newValue: number | number[]) => {
    console.log(newValue);
  };

  return (
    <div className="box"
      style={{ display: 'flex', padding: "5px", width: "100%", height: '100%', paddingBottom: '1%' }}>
      
      <GraphContainer />
      
    </div>
  );
}

export function Box1() {
  const { electrode } = useContext(ElectrodeFocusContext) as IElectrodeFocusContext;
  
  const data = getSpectrogramDataSync(0);

  const handleChange = (event: Event, newValue: number | number[]) => {
      console.log(newValue);
  };

  return (
    <div id="box1" className="box">
      <Spectrogram />
      <SlidingBar time={data.t} onChange={handleChange} />
    </div>
  );
}

export default Box;