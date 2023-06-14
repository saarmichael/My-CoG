import { useContext, useEffect, useRef, useState } from "react";
import { Box, Checkbox, Grid, TextField, Slider } from '@mui/material';
import { ActiveNodeProps, GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import { SlidingBar } from "../tools_components/SlidingBar";
import { getConnectivityMeasuresList, getDuration, getFrequencies } from "../../shared/RequestsService";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDropdownStyles } from "./Styles";
import CircularProgress from '@mui/material/CircularProgress';
import { useTextFieldsStyle } from "./Styles";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { TimeInterval } from "../../shared/GraphRelated";
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