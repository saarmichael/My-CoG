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

export function Box() {
  return (
    <div className="box"
      style={{ display: 'flex', padding: "5px", width: "100%", height: '100%', paddingBottom: '1%' }}>
      
      <GraphContainer />
    </div>
  );
}

export function Box1() {
  const { electrode } = useContext(ElectrodeFocusContext) as IElectrodeFocusContext;
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10000);

  const handleTimeframeChange = (newStartTime: number, newEndTime: number) => {
    setStartTime(newStartTime);
    setEndTime(newEndTime);
  };
  return (
    <div id="box1" className="box">
      <Spectrogram />
      <SlidingBar start={0} end={100} min={0} max={1000} onChange={handleTimeframeChange} />
    </div>
  );
}

export default Box;