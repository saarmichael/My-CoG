import GridLayout from "react-grid-layout";
import React from "react";
import './GridStyle.css';
import BasicNetGraph from "../../components/BasicNetGraph";
import BasicSpectogram from "../../components/BasicSpectogram";
import { BasicHeatMap } from "../../components/BasicHeatMap";
import LCChart from "../../components/LCChart";

class MainGrid extends React.Component {
  render() {
    // layout is an array of objects, see the demo for more complete usage
    const layout = [
      { i: "a", x: 0, y: 0, w: 5, h: 20 },
      { i: "b", x: 5, y: 0, w: 5, h: 20 },
    ];
    return (
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={2000}
      >
        <div key="a" className="card">
            <BasicHeatMap />
        </div>
        <div key="b" className="card">
            <BasicNetGraph />
        </div>
      </GridLayout>
    );
  }
}

export default MainGrid;