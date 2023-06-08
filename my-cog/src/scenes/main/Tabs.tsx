import React, { useContext, useEffect, useRef, useState } from "react";
import { Rnd } from 'react-rnd';
import "../../components/SideBar.css";
import { Box, Box1, Box2, BoxProps } from "./GridComponents";
import "./Tabs.css";
import Sidebar from "../../components/SideBar";
import AddIcon from '@mui/icons-material/Add';
import { Grid } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useDropdownStyles } from "../global/Styles";


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

    const renderComponentOptions = () => {
      return tabs[activeTabIndex].content.props.children.map((component: JSX.Element, index: number) => {
          const componentType = component.type as React.FC<BoxProps>;
          const displayName = component.props.name as string;
  
          return componentType === React.Fragment ? null : (
              <MenuItem key={index} value={`${hiddenComponentIndex.includes(index) ? 'Show ' : 'Hide '}${displayName}`} onClick={() => handleComponentSelect(index)}>
                  {`${hiddenComponentIndex.includes(index) ? 'Show ' : 'Hide '}${displayName}`}
              </MenuItem>
          );
      });
  };


    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
    const classes = useDropdownStyles();

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
          <Select
              className={classes.customDropdown}
              style={{ width: '200px', position: 'absolute', right: '0', top: '30px' }}
              value='Hide component'
              displayEmpty
              renderValue={() => 'Hide component'}
          >
              {renderComponentOptions()}
          </Select>
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