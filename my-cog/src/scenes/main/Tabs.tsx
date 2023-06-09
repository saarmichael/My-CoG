import React, { useContext, useEffect, useRef, useState } from "react";
import { Rnd } from 'react-rnd';
import "../../components/SideBar.css";
import { Box, Box1, Box2, BoxProps } from "./GridComponents";
import "./Tabs.css";
import Sidebar from "../../components/SideBar";
import AddIcon from '@mui/icons-material/Add';
import { Grid } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { customStyles, useDropdownStyles } from "../global/Styles";
import Select from 'react-select';

interface OptionType {
  value: number;
  label: string;
}


interface Tab {
  label: string;
  content: JSX.Element;
}

interface TabsProps {
  tabs: Tab[];
  onAddTab?: () => void;
}

type Data = Promise<number[][]>;

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
  

    const handleComponentSelect = (index: number) => {
        setHiddenComponentIndex((prev) => {
            if (prev.includes(index)) {
                return prev.filter((i) => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const options = tabs[activeTabIndex].content.props.children
    .filter((component: JSX.Element) => component.type !== React.Fragment)
    .map((component: JSX.Element, index: number) => {
      const displayName = component.props.name as string;

      return {
        value: index,
        label: `${hiddenComponentIndex.includes(index) ? 'Show ' : 'Hide '}${displayName}`
      };
    });

    const handleChange = (selectedOption: any) => {
      handleComponentSelect(selectedOption.value);
    };


    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

  
    // Setting the value prop to a fixed object
    const fixedValue = { label: "Hide component", value: 0 };

    return (
      <div className="container">
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="bloc-tabs" style={{ width: '100%' }}>
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
                <button className="plus" onClick={handleAddTabClick}><AddIcon/></button>
              )}
          </div>
          <div style={{position: 'absolute',  right: '10px', top: '30px'}}>
            <Select
              value={fixedValue}
              isSearchable={false}
              onChange={handleChange}
              options={options}
              styles={customStyles}
            />
          </div>
          <div style={{ overflow: 'auto', flexGrow: 1 }}>
            {tabs.map((tab, index) => (
              <Grid container justifyContent="center" spacing={12} style={{ display: index === activeTabIndex ? '' : 'none' }}>
                {tab.content.props.children.map((component: JSX.Element, index: number) => (
                  <Grid item  xs={5} style={{ display: hiddenComponentIndex.includes(index) ? 'none' : '' }}>
                    {component}
                  </Grid>
                ))}
              </Grid>
            ))}
          </div>
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
        <Box name="Graph"/>
        <Box1 name="Grid"/>
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
          minHeight={190}
          disableDragging={true}
        >
          <Box2 />
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

  return (

    <Tabs tabs={tabs} onAddTab={handleAddTab} />

  );
};

export default Tabbing;