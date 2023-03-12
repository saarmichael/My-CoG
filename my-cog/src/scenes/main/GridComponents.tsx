import Basic3DSpectogram from "../../components/Basic3DSpectogram";
import BasicGraphinGraph from "../../components/BasicGraphinGraph";
import { BasicHeatMap } from "../../components/BasicHeatMap";
import './GridStyle.css';

export function Box() {
  return (
    <div className="box"
      style={{ padding: "5px", width:"100%", height: '100%', paddingBottom: '40px' }}>
      <BasicGraphinGraph></BasicGraphinGraph>
    </div>
  );
}

export function Box1() {

  return (
    <div id="box1" className="box">
      <Basic3DSpectogram />
    </div>);
}

export default Box;