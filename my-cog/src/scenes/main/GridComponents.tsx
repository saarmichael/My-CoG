import { useContext } from "react";
import { GraphContainer } from "../../components/GraphContainer";
import { GridGraph } from "../../components/GridGraph";
import SlidingBar from "../../components/SlidingBar";
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
      <Rnd default={{
        x: 10,
        y: 100,
        width: 600,
        height: 600,
      }}
        bounds="parent"
        minWidth={350}
        minHeight={400}>
        <div className="box"
              style={{ display: 'flex', padding: "5px", width: "100%", height: '100%', paddingBottom: '1%' }}>
            <GraphContainer />
        </div>
      </Rnd>
    </>
  );
}

export const Box1: React.FC<BoxProps> = () => {
  const { electrode } = useContext(GlobalDataContext) as IGlobalDataContext;

  return(
    <div>
        <GraphVisToggles />
        <Rnd default={{
          x: 15,
          y: 0,
          width: 320,
          height: 200,
        }}
          bounds="parent"
          minWidth={600}
          minHeight={550}
          disableDragging={true}
          >
          <EditablesContainer />
        </Rnd>
      
    </div>
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