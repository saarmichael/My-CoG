import AddIcon from '@mui/icons-material/Add';
import { Grid } from '@mui/material';
import React, { useState } from "react";
import Select from 'react-select';
import { EditablesContainer } from "../../components/data_components/EditablesContainer";
import { GraphContainer } from "../../components/data_components/GraphContainer";
import TimeSeries from "../../components/data_components/TimeSeries";
import { Box } from "../../components/tools_components/GridComponents";
import { customStyles } from "../../components/tools_components/Styles";
import Sidebar from "./SideBar";
import "./Tabs.css";



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
                {tab.content.props.children
                .filter((component: JSX.Element) => component.type !== React.Fragment)
                .map((component: JSX.Element, index: number) => (
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
      label: "Connectivity",
      content: (
        <div className="active-content">
          <Box name="Graph" content={<GraphContainer />} />
          <Box name="Grid" content={<EditablesContainer />} />
        </div>
      ),
    },
    {
      label: "Raw Signal",
      content: (
        <div className="active-content">
          <Box name="Time Series" content={<TimeSeries />} />
          <></>
        </div>
      ),
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