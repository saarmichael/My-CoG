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

    // JSX for color picking: a div when clicked sets showPicker to true, and a color picker when showPicker is true

    return (
        <>

        </>
    );
};