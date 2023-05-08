import { useContext, useState } from "react";

import { GridProvider, GridContext, IGridFocusContext } from "../contexts/GridContext";
import { EditableGrid } from "./EditableGrid";

const Container = () => {

    const [applyMove, setApplyMove] = useState<any>([]);
    const { anchorNode, setAnchorNode, selectedNode, setSelectedNode } = useContext(GridContext) as IGridFocusContext;

    return (
        <>
            <h1>Editable Grid</h1>
            <button title="set anchor node" onClick={() => {
                setAnchorNode(selectedNode);
            }}>Select Node</button>




            <button title="apply move" onClick={() => {
                setApplyMove([...applyMove]);
            }}>Move</button>


            <EditableGrid N={5} M={5} anchorTrigger={anchorNode} applyMove={applyMove}/>
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