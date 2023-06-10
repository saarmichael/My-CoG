import { Checkbox, FormControlLabel } from '@mui/material';
import { useContext, useRef } from 'react';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../../contexts/VisualGraphOptionsContext';
import './GraphVisCheckbox.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const GraphVisCheckbox = (props: { label: string; checked: boolean; }) => {

    const { options, setOptions, settings, setSettings } = useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
    const inputRef = useRef<HTMLInputElement>(null);
    const thisOption = options.find((option) => option.label === props.label);
    return (
        <>
            <FormControlLabel
                className='checkbox'
                control={
                    <Checkbox
                        icon={<CheckCircleOutlineIcon />}
                        checkedIcon={<CheckCircleIcon />}
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
                        style={{ color: 'purple' }}
                    />
                }
                label={props.label}
            />
            {(thisOption?.needValue && thisOption.checked) ? <> {props.label}
                <>
                    <input
                        type='number'
                        step='0.1'
                        defaultValue={thisOption.value}
                        ref={inputRef}
                    />
                    <button
                        onClick={() => {
                            const newValue = Number(inputRef.current?.value);
                            // change the setting in the settings object
                            if (thisOption.settingName) {
                                setSettings({
                                    ...settings,
                                    [thisOption.settingName]: newValue
                                });
                                setOptions(options.map((option) => {
                                    if (option.label === props.label) {
                                        return {
                                            ...option,
                                            value: newValue
                                        };
                                    }
                                    return option;
                                }));
                            }
                        }}>Submit</button>

                </>

            </> : null}
        </>
    );
}
