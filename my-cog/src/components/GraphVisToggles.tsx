import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CheckIcon from '@mui/material/Checkbox';
import { useContext } from 'react';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';
import { Checkbox } from '@mui/material';
import { GraphVisCheckbox } from './GraphVisCheckbox';


export const GraphVisToggles = () => {

    const { options } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;

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
        </>
    );
};