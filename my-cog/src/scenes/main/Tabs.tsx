import { Box, Box1 } from "./GridComponents";
import "./Tabs.css";
import { Rnd } from 'react-rnd';
import React from "react";
import { useState } from "react";
import { DataOptions } from "../../components/DataOptions";
import { ElectrodeFocusProvider } from "../../contexts/ElectrodeFocusContext";




interface Tab {
  label: string;
  content: JSX.Element;
}

interface TabsProps {
  tabs: Tab[];
  onAddTab?: () => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, onAddTab }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [hiddenComponentIndex, setHiddenComponentIndex] = useState<number[]>([]);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
    setHiddenComponentIndex([]);
  };

  const handleAddTabClick = () => {
    if (onAddTab) {
      onAddTab();
    }
  };

  const handleComponentSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = Number(event.target.value);
    setHiddenComponentIndex((prev) => {
      if (prev.includes(selectedIndex)) {
        // Remove the index if it's already in the list
        return prev.filter((i) => i !== selectedIndex);
      } else {
        // Add the index if it's not in the list
        return [...prev, selectedIndex];
      }
    });
  };

  const renderComponentOptions = () => {
    return tabs[activeTabIndex].content.props.children.map((component: JSX.Element, index: number) => {
      const componentType = component.type as React.FC;
      return componentType === React.Fragment ? null : (
        <option key={index} value={index}>
          {hiddenComponentIndex.includes(index) ? 'Show ' : 'Hide '} {componentType.displayName || componentType.name || "Component"} {index + 1}
        </option>
      );
    });
  };


  return (
    <div className="container">
      <div className="bloc-tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={index === activeTabIndex ? "tabs active-tabs" : "tabs"}
          >
            {tab.label}
          </button>
        ))}
        {onAddTab && (
          <button onClick={handleAddTabClick}>➕</button>
        )}
      </div>
      <div>
        <select value="" onChange={handleComponentSelect}>
          <option value="" disabled>
            Select a component to hide
          </option>
          {renderComponentOptions()}
        </select>
        {tabs[activeTabIndex].content.props.children.map((component: JSX.Element, index: number) => (
          hiddenComponentIndex.includes(index)
            ? null
            : (
              <div key={index}>
                {component}
              </div>
            )
        ))}
      </div>
    </div>
  );
};

const Tabbing = () => {
  const [tabs, setTabs] = useState([
    {
      label: "Tab 1",
      content: <div
        className="active-content"
      >
        <DataOptions />
        <Rnd default={{
          x: 15,
          y: 100,
          width: 320,
          height: 200,
        }}
          bounds="parent"
          minWidth={600}
          minHeight={650}>
          <Box1 />
        </Rnd>

        <Rnd default={{
          x: 615,
          y: 100,
          width: 320,
          height: 200,
        }}
          bounds="parent"
          minWidth={600}
          minHeight={650}>
          <Box />
        </Rnd>
      </div>,
    },
    {
      label: "Tab 2",
      content: <div
        className="active-content"
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
        <></>
      </div>,
    },
    {
      label: "Tab 3",
      content: <div className="active-content">
        <h2>Tab 1 Content</h2>
        <p>This is the first paragraph.</p>
        <p>This is the second paragraph.</p>
      </div>,
    },
  ]);

  const handleAddTab = () => {
    const newTabLabel = `Tab ${tabs.length + 1}`;
    const newTabContent = <div><div>Content for {newTabLabel}</div><></></div>;
    setTabs([...tabs, { label: newTabLabel, content: newTabContent }]);
  };

  return <Tabs tabs={tabs} onAddTab={handleAddTab} />;
};

export default Tabbing;