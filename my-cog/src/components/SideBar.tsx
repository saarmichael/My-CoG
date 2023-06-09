import { FormGroup } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { IVisGraphOptionsContext, VisGraphOptionsContext } from "../contexts/VisualGraphOptionsContext";
import { ColorPicker } from "./ColorPicker";
import { GraphVisCheckbox } from "./GraphVisCheckbox";
import './SideBar.css';
import { getSettings, saveSettings } from "../shared/ServerRequests";
import { use } from "cytoscape";
import { reorganizeOptions } from "../shared/RequestsService";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { setOptions, setSettings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
    const { options, settings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
    const [showPicker, setShowPicker] = useState(false);
    useEffect(() => {
        getSettings().then((data) => {
            let reorganizedOptions = reorganizeOptions(data.options, options);
            setOptions(reorganizedOptions);
            setSettings(data.settings);
        });
    }, []);
    const saveUserSettings = () => {
        saveSettings({ options, settings });
    };

    const colorPickDiv = (
        <div className="submit-button"
            style={{
                backgroundColor: settings.edgeColor?.firstColor ? (settings.edgeColor?.firstColor) : "#000000",
            }}
            onClick={() => {
                setShowPicker(!showPicker);
            }}
        >
            Color Picker
        </div>
    );

    return (
        <div id="sidebar-container">
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="toggle-button" onClick={onClose}>
                    {isOpen ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
                </button>
                <div>
                    <h2>Visual Options</h2>
                    <FormGroup>
                        {options.map((option, index) => {
                            return (
                                <GraphVisCheckbox
                                    key={index}
                                    label={option.label}
                                    checked={option.checked}
                                />
                            );
                        })}
                    </FormGroup>
                    <div style={{ 
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "center", 
    alignItems: "center", 
    width: "100%" 
}}>
    <div>{colorPickDiv}</div>
    {showPicker ? <div><ColorPicker /></div> : null}
</div>

                </div>
                <button onClick={saveUserSettings} style={ {marginBottom: "20px"} } className="submit-button">Save Settings</button>
            </div>
        </div>

    );
};

export default Sidebar;