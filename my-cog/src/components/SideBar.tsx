import { FormGroup } from "@mui/material";
import { useContext, useState } from "react";
import { IVisGraphOptionsContext, VisGraphOptionsContext } from "../contexts/VisualGraphOptionsContext";
import { ColorPicker } from "./ColorPicker";
import { GraphVisCheckbox } from "./GraphVisCheckbox";
import './SideBar.css';


const Sidebar = () => {

    const { options, settings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
    const [isOpen, setIsOpen] = useState(true);
    const [showPicker, setShowPicker] = useState(false);

    const colorPickDiv = (
        <div
            style={{
                // make it like a rectangle with rounded corners, and quite small
                borderRadius: "5px",
                border: "1px solid black",
                width: "100%",
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
            <button style={{ fontSize: '20px' }} onClick={
                () => setIsOpen(!isOpen)}>{isOpen ? "⬅️" : "➡️"}</button>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <h2>Visual Options</h2>
                <FormGroup >
                    {options.map((option, index) => {
                        return (
                            <GraphVisCheckbox
                                key={index}
                                label={option.label}
                                checked={option.checked}
                            />
                        );
                    })
                    }
                </FormGroup>
                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    {colorPickDiv}
                    {showPicker ? <ColorPicker /> : null}
                </div>
            </div>
        </div >
    );
};

export default Sidebar;