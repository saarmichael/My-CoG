import { useState } from "react";
import { Rnd } from "react-rnd";
import { Box, Box1 } from "./GridComponents";
import "./Tabs.css";
import React from "react";

function Tabs() {
  const [toggleState, setToggleState] = useState(1);
  const [numTabs, setNumTabs] = useState(3);

  const toggleTab = (index:number) => {
    setToggleState(index);
  };

  const [tabsList, setTabsList] = useState<JSX.Element[]>([]);

  const [tabContents, setTabContents] = useState<JSX.Element[]>([]);

  const addTab = () => {
    let tab = topTab(numTabs + 1);
    let content = new contentTab(numTabs + 1);
    setNumTabs(numTabs + 1);
    setTabsList([...tabsList, tab]);
    setTabContents([...tabContents, content.render()]);
    toggleTab(numTabs + 1);
  };
  
  const topTab = (index:number) => {
        return (<button
          className={toggleState === index ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(index)}
        >
          Tab {index}
        </button>);
  }

  

  class contentTab extends React.Component {
    index: number;
    constructor(index: number) {
      super(index);
      this.index = index;
    }
    
    render() {
      return (<div
        className={toggleState === this.index ? "content  active-content" : "content"}
        >
        Content of tab {this.index}
      </div>);
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
            <Rnd default={{
                    x: 15,
                    y: 100,
                    width: 320,
                    height: 200,
                  }}
                  bounds="parent"
                  minWidth={500}
                  minHeight={190}>
              <Box/>
            </Rnd>
        </div>
          <div
          className={toggleState === 2 ? "content  active-content" : "content"}
          >
          <Rnd default={{
                  x: 15,
                  y: 100,
                  width: 900,
                  height: 500,
                }}
                bounds="parent"
                minWidth={500}
                minHeight={190}>
            <Box1/>
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
        {tabContents}
      </div>
    </div>
  );
}

export default Tabs;