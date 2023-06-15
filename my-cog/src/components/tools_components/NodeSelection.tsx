import { Box, Checkbox } from '@mui/material';
import { ActiveNodeProps } from "../../contexts/ElectrodeFocusContext";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import { GraphinData } from "@antv/graphin";

export interface NodeSelectionProps {
    state: GraphinData;
    nodesList: ActiveNodeProps[];
    onClick: (label: string) => void;
}


export const NodeSelection = (props: NodeSelectionProps) => {

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',  // disable wrapping
                overflowY: 'auto',  // enable horizontal scroll
                overflowX: 'hidden',
                alignItems: 'center',
                maxHeight: '600px'
            }}>
                {props.state.nodes.map((node) => (
                    <div key={node.id} onClick={() => props.onClick(node.style?.label?.value ? node.style.label.value : node.id)}>
                        <Checkbox
                            style={{ transform: 'scale(0.8)', color: 'purple' }}
                            icon={<CheckCircleOutlineIcon />}
                            checkedIcon={<CheckCircleIcon />}
                            checked={props.nodesList.map((node) => node.id).includes(node.id)}
                            inputProps={{ 'aria-labelledby': node.id }}
                        />
                        <Typography variant="body2" align="center" style={{ fontSize: '0.65em' }}>
                            {node.style?.label?.value ? node.style.label.value : node.id}
                        </Typography>
                    </div>
                ))}
            </Box>
        </>
    );
};