import { Checkbox, FormControlLabel } from '@mui/material';
import { useContext } from 'react';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';
import './GraphVisCheckbox.css';

export const GraphVisCheckbox = (props: { label: string; checked: boolean; }) => {

    const { options, setOptions } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;

    return (
        <>
            <FormControlLabel
                className='checkbox'
                control={
                    <Checkbox
                        value={props.label}
                        checked={props.checked}
                        onChange={() => {
                            const newOptions = options.map((option) => {
                                if (option.label === props.label) {
                                    return {
                                        ...option,
                                        checked: !option.checked
                                    };
                                }
                                return option;
                            });
                            setOptions(newOptions);
                        }
                        }
                    />
                }
                label={props.label}
            />

        </>
    );
}

