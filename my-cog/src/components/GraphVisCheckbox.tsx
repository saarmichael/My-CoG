import { Checkbox, FormControlLabel } from '@mui/material';
import { useContext, useRef } from 'react';
import { IVisGraphOptionsContext, VisGraphOptionsContext } from '../contexts/VisualGraphOptionsContext';
import './GraphVisCheckbox.css';

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
            {(thisOption?.needValue && thisOption.checked) ? <> {props.label}
                <>
                    <input
                        type='number'
                        value={thisOption.value}
                        ref={inputRef}
                    />
                    <button
                        onClick={() => {
                            // change the setting in the settings object
                            if (thisOption.settingName) {
                                setSettings({
                                    ...settings,
                                    [thisOption.settingName]: Number(inputRef.current?.value)
                                });
                            }
                        }}>Submit</button>

                </>

            </> : null}
        </>
    );
}

