import { useContext } from "react";
import Basic3DSpectogram from "../../components/Basic3DSpectogram";
import BasicGraphinGraph from "../../components/BasicGraphinGraph";
import DataContainer from "../../components/DataContainer";
import { BasicHeatMap } from "../../components/BasicHeatMap";
import Spectrogram from "../../components/Spectrogram";
import { ElectrodeFocusContext, IElectrodeFocusContext } from "../../contexts/ElectrodeFocusContext";
import './GridStyle.css';

export function Box() {
  return (
    <div className="box"
      style={{ display: 'flex', padding: "5px", width: "100%", height: '100%', paddingBottom: '1%' }}>
      <BasicGraphinGraph />
    </div>
  );
}

export function Box1() {
  const { electrode } = useContext(ElectrodeFocusContext) as IElectrodeFocusContext;
  return (
    <div id="box1" className="box">
      <Spectrogram />
      {electrode}
    </div>);
}

export default Box;