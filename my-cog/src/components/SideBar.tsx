import { FormGroup } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { IVisGraphOptionsContext, VisGraphOptionsContext } from "../contexts/VisualGraphOptionsContext";
import { ColorPicker } from "./ColorPicker";
import { GraphVisCheckbox } from "./GraphVisCheckbox";
import './SideBar.css';
import { getSettings, saveSettings } from "../shared/ServerRequests";
import { use } from "cytoscape";
import { reorganizeOptions } from "../shared/RequestsService";

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
        <div
            style={{
                // make it like a rectangle with rounded corners, and quite small
                borderRadius: "5px",
                border: "1px solid black",
                width: "95%",
                height: "20px",
                // make it look like a button
                backgroundColor: settings.edgeColor?.firstColor ? (settings.edgeColor?.firstColor) : "#000000",
                cursor: "pointer",
                // make it look like a button
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // make it look like a button
                boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
                // make it look like a button
                transition: "all 0.2s ease-in-out",

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
                    {isOpen ? "⬅" : "➡"}
                </button>
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
                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    {colorPickDiv}
                    {showPicker ? <ColorPicker /> : null}
                </div>
                <button onClick={saveUserSettings}
                    style={{
                        // make it like a rectangle with rounded corners, and quite small
                        borderRadius: "5px",
                        border: "1px solid black",
                        width: "95%",
                        height: "20px",
                        // make it look like a button
                        backgroundColor: settings.edgeColor?.firstColor ? (settings.edgeColor?.firstColor) : "#000000",
                        cursor: "pointer",
                        // make it look like a button
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // make it look like a button
                        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
                        // make it look like a button
                        transition: "all 0.2s ease-in-out",

                    }}>Save Settings</button>
            </div>
        </div>

    );
};

export default Sidebar;