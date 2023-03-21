import { useState } from "react";
import { Box, Box1 } from "./GridComponents";
import "./Tabs.css";
import { Rnd } from 'react-rnd';
import React from "react";
import { ElectrodeFocusProvider } from "../../contexts/ElectrodeFocusContext";
import { DataOptions } from "../../components/DataOptions";

function Tabs() {
  const [toggleState, setToggleState] = useState(1);
  const [numTabs, setNumTabs] = useState(3);

  const toggleTab = (index: number) => {
    setToggleState(index);
  };

  const [tabsList, setTabsList] = useState<JSX.Element[]>([]);

  const [tabContents, setTabContents] = useState<JSX.Element[]>([]);

  const addTab = () => {
    setNumTabs(numTabs + 1);
    setTabsList([...tabsList, <button
      className="tabs"
      onClick={() => toggleTab(4)}
    >
      Tab {numTabs + 1}
    </button>]);
    setTabContents([...tabContents, <div></div>]);
  };

  class topTab extends React.Component {
    index: number;
    constructor(index: number) {
      super(index);
      this.index = index;
    }

    render() {
      return (<button
        className={toggleState === this.index ? "tabs active-tabs" : "tabs"}
        onClick={() => toggleTab(this.index)}
      >
        Tab {this.index}
      </button>);
    }

  };

  return (
    <div className="container">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          Tab 1
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          Tab 2
        </button>
        <button
          className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(3)}
        >
          Tab 3
        </button>
        {tabsList}
        <button
          className="tabs"
          onClick={() => addTab()}
        >
          +
        </button>

      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          <DataOptions />
          <Rnd default={{
            x: 15,
            y: 100,
            width: 320,
            height: 200,
          }}
            bounds="parent"
            minWidth={1000}
            minHeight={650}>
            <Box1 />
          </Rnd>

          <Rnd default={{
            x: 1015,
            y: 100,
            width: 320,
            height: 200,
          }}
            bounds="parent"
            minWidth={650}
            minHeight={650}>
            <Box />
          </Rnd>
        </div>
        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          <Rnd default={{
            x: 15,
            y: 100,
            width: 450,
            height: 300,
          }}
            bounds="parent"
            minWidth={500}
            minHeight={190}>
            <Box1 />
          </Rnd>
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
        >
          <h2>Content 3</h2>
          <hr />
          <p>
            E
          </p>
        </div>
      </div>
      {tabContents}
    </div>
  );
}

export default Tabs;