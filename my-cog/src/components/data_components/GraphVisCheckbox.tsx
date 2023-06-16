import { Box, Button, Checkbox, FormControlLabel, TextField, Grid } from '@mui/material';
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
            {(thisOption?.needValue && thisOption.checked) ? <>
                <Grid container justifyContent='center' spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                            type='number'
                            size='small'
                            style={{paddingLeft: '20%', paddingRight: '20%'}}
                            inputProps={{
                                step: 0.1,
                            }}
                            inputRef={inputRef}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div className='submit-button'
                            style={{marginBottom: '10px', width: '65%'}}
                            
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
                            }}
                        >
                            Set threshold
                        </div>
                    </Grid>
                </Grid>
            </> : null}
        </>
    );
}
