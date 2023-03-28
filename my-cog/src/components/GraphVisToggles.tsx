import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CheckIcon from '@mui/material/Checkbox';
import { useContext, useState } from 'react';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';
import { Checkbox } from '@mui/material';
import { GraphVisCheckbox } from './GraphVisCheckbox';
import { ColorPicker } from './ColorPicker';

export const GraphVisToggles = () => {

    const { options, settings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
    const [showPicker, setShowPicker] = useState(false);
    // JSX for color picking: a div when clicked sets showPicker to true, and a color picker when showPicker is true
    const colorPickDiv = (
        <div
            style={{
                // make it like a rectangle with rounded corners, and quite small
                borderRadius: "5px",
                border: "1px solid black",
                width: "100px",
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
        <>
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
            <div style={{ display: "flex", flexDirection: "column", width: "10%" }}>
                {colorPickDiv}
                {showPicker ? <ColorPicker /> : null}
            </div>

        </>
    );
};