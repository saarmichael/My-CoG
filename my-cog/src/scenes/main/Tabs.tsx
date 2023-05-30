import React, { useContext, useEffect, useRef, useState } from "react";
import { Rnd } from 'react-rnd';
import { DataOptions } from "../../components/DataOptions";
import { GraphVisToggles } from "../../components/GraphVisToggles";
import "../../components/SideBar.css";
import { Box, Box1, Box2, BoxProps } from "./GridComponents";
import "./Tabs.css";
import Sidebar from "../../components/SideBar";
import { ComponentToggleBar, MenuItem } from "./ComponentToggleBar";
import { apiGET } from "../../shared/ServerRequests";
import { AxiosResponse } from "axios";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import { Modal } from "@mui/material";
import ModalPopup from "../global/ModalPopup";


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


    
    const [activeMenu, setActiveMenu] = useState<number | null>(null);

    const toggleMenu = (index: number) => {
        setActiveMenu(activeMenu === index ? null : index);
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
                <div key={index} onClick={() => handleComponentSelect(index)}>
                    {hiddenComponentIndex.includes(index) ? 'Show ' : 'Hide '} {displayName}
                </div>
            );
        });
    };

    const menuItems: MenuItem[] = [
        {
            name: 'Select a component to hide',
            items: renderComponentOptions(),
            action: (event: React.MouseEvent<HTMLInputElement>) => {
              event.stopPropagation();
              }
        }
    ];


    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
    

    return (
      <div className="container">
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar}/>
        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
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
              <button className="plus" onClick={handleAddTabClick}>➕</button>
            )}
          </div>
          
          <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
            {tabs.map((tab, index) => (
              <div style={{ display: index === activeTabIndex ? '' : 'none', height: '100%' }}>
                {tab.content.props.children.map((component: JSX.Element, index: number) => (
                  <div style={{ display: hiddenComponentIndex.includes(index) ? 'none' : '', width:'100%', height:'100%', position:'absolute'}}>
                    {component}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="hide-component">
              <ComponentToggleBar menuItems={menuItems} activeMenu={activeMenu} toggleMenu={toggleMenu} />
          </div>
          <DataOptions />
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

        <Box1 name="Grid"/>

        <Box name="Graph"/>

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