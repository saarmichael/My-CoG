import { useContext, useState } from "react";

import { GridProvider, GridContext, IGridFocusContext } from "../contexts/GridContext";
import { EditableGrid } from "./EditableGrid";
import { TextField } from "@mui/material";
import SlidingBar from "./SlidingBar";

const Container = () => {

    const [applyMove, setApplyMove] = useState<any>([]);
    const { anchorNode, setAnchorNode, selectedNode, setSelectedNode, setAngle, setRotationReady, rotationReady } = useContext(GridContext) as IGridFocusContext;

    return (
        <>
            <h1>Editable Grid</h1>
            <button title="set anchor node" onClick={() => {
                setAnchorNode(selectedNode);
            }}>Select Node</button>

            &nbsp;&nbsp;&nbsp;&nbsp;


            <button title="apply move" onClick={() => {
                setApplyMove([...applyMove]);
            }}>Move</button>
            &nbsp;&nbsp;&nbsp;&nbsp;

            <SlidingBar range={360} onChange={(event, newValue) => {
                    const inputAngle = newValue[0] % 360;
                    setAngle(inputAngle);
                }}
                toSubmit={false}
                keepDistance={false}
                />

            <button title="set for rotation" onClick={() => {
                setRotationReady(true);
            }}>Ready to rotate</button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            
            <span>Anchor Node: {anchorNode}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>Selected Node: {selectedNode}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            
            <TextField type="number" size="small" label={"angle"}
                onChange={(event) => {
                    const inputAngle = Number(event.target.value) % 360;
                    setAngle(inputAngle);
                }} />

            &nbsp;&nbsp;&nbsp;&nbsp;

            <EditableGrid N={4} M={3} anchorTrigger={anchorNode} applyMove={applyMove} rotationReady={rotationReady} />
        </>
    )
}



export const EditablesContainer = () => {

    return (
        <>
            <GridProvider>
                <Container />
            </GridProvider >
        </>
    )

}