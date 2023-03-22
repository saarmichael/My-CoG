import { Checkbox } from '@mui/material';

export const GraphVisCheckbox = (props: { label: string; checked: boolean; onChange: () => void }) => {
    return (
        <>
            <Checkbox
                checked={props.checked}
                onChange={() => {
                    props.onChange();
                }}
            />
            {props.label}
        </>
    );
}