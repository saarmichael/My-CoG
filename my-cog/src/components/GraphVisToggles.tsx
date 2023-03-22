import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CheckIcon from '@mui/material/Checkbox';
import { useContext } from 'react';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';
import { Checkbox } from '@mui/material';
import { GraphVisCheckbox } from './GraphVisCheckbox';

export const GraphVisToggles = () => {

    const { widthView, setWidthView, colorCodedView, setColorCodedView, thresholdView, setThresholdView } =
        useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;

    return (
        <>
            <GraphVisCheckbox
                label="Width View"
                checked={widthView}
                onChange={() => {
                    setWidthView(!widthView);
                }}
            />
            <GraphVisCheckbox
                label="Color Coded View"
                checked={colorCodedView}
                onChange={() => {
                    setColorCodedView(!colorCodedView);
                }}
            />
            <GraphVisCheckbox
                label="Threshold View"
                checked={thresholdView}
                onChange={() => {
                    setThresholdView(!thresholdView);
                }}
            />
        </>
    );
};