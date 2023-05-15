import { useContext } from "react";
import { GraphContainer } from "../../components/GraphContainer";
import { GridGraph } from "../../components/GridGraph";
import SlidingBar from "../../components/SlidingBar";
import Spectrogram from "../../components/Spectrogram";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import { getCoherenceByTime, getSpectrogramDataSync } from "../../shared/getters";
import './GridStyle.css';
import { EditablesContainer } from "../../components/EditablesContainer";

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
  const { electrode } = useContext(GlobalDataContext) as IGlobalDataContext;

  return(
    <>
      <EditablesContainer />
    </>
  )
}

export function Box2() {
  return (
    <div className="box">
      <GridGraph />
    </div>
  );
}


export default Box;