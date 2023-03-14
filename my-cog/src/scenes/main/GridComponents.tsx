import { useContext } from "react";
import Basic3DSpectogram from "../../components/Basic3DSpectogram";
import BasicGraphinGraph from "../../components/BasicGraphinGraph";
import DataContainer from "../../components/DataContainer";
import { ElectrodeFocusContext, IElectrodeFocusContext } from "../../contexts/ElectrodeFocusContext";
import './GridStyle.css';

export function Box() {
  return (
    <div className="box"
      style={{ padding: "5px", width: "100%", height: '100%', paddingBottom: '40px' }}>
      <BasicGraphinGraph />
    </div>
  );
}

export function Box1 (){

return (<div className="box">
          <BasicHeatMap />
        </div>)
}

export default Box;