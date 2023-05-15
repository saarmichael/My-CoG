import { useContext, useEffect, useRef, useState } from "react";

import { GridProvider, GridContext, IGridFocusContext } from "../contexts/GridContext";
import { EditableGrid } from "./EditableGrid";
import { TextField } from "@mui/material";
import SlidingBar from "./SlidingBar";
import { fetchImage } from "../shared/RequestsService";


const ImageSelector = () => {

    const { backImgList, setBackImgList,
        backgroundImg, setBackgroundImg } = useContext(GridContext) as IGridFocusContext;

    const refAzimuth = useRef<HTMLInputElement>(null);
    const refElevation = useRef<HTMLInputElement>(null);
    const refDistance = useRef<HTMLInputElement>(null);


    useEffect(() => {
        // get the initial basic image and initialize the list with it
        const getImage = async () => {
            const image = await fetchImage(0, 0, 360);
            setBackImgList([...backImgList, image]);
            setBackgroundImg("url(" + image + ")");
        }
        getImage();
    }, []);


    // return a select element with all the images
    return (
        <>
            <select onChange={(e) => {
                setBackgroundImg("url(" + backImgList[Number(e.target.value)] + ")");
            }}>
                {backImgList.map((img, index) => {
                    return <option key={index} value={index}>{img}</option>
                }
                )}
            </select>

            <TextField inputRef={refAzimuth} type="number" size="small" label={"azimuth"} />
            <TextField inputRef={refElevation} type="number" size="small" label={"elevation"} />
            <TextField inputRef={refDistance} type="number" size="small" label={"distance"} />

            <button onClick={async () => {
                const image = await fetchImage(
                    Number(refAzimuth.current?.value),
                    Number(refElevation.current?.value),
                    Number(refDistance.current?.value)
                );
                setBackImgList([...backImgList, image]);
                setBackgroundImg("url(" + image + ")");
            }}>Add Image</button>

        </>
    );

}

const Container = () => {

    const [applyMove, setApplyMove] = useState<any>([]);
    const {
        anchorNode, setAnchorNode,
        selectedNode, setSelectedNode,
        setAngle,
        setRotationReady,
        rotationReady,
    } = useContext(GridContext) as IGridFocusContext;

    return (
        <>
            <h1>Editable Grid</h1>

            <div>
                <ImageSelector />
            </div>

            <div>
                <SlidingBar range={360} onChange={(event, newValue) => {
                    const inputAngle = newValue[0] % 360;
                    setAngle(inputAngle);
                }}
                    toSubmit={false}
                    keepDistance={false}
                />

                <TextField type="number" size="small" label={"angle"}
                    onChange={(event) => {
                        const inputAngle = Number(event.target.value) % 360;
                        setAngle(inputAngle);
                    }} />
            </div>
            <div>
                <button title="set anchor node" onClick={() => {
                    setAnchorNode(selectedNode);
                }}>Select Node</button>

                &nbsp;&nbsp;&nbsp;&nbsp;

                <button title="apply move" onClick={() => {
                    setApplyMove([...applyMove]);
                }}>Move</button>
                &nbsp;&nbsp;&nbsp;&nbsp;

                <button title="set for rotation" onClick={() => {
                    setRotationReady(true);
                }}>Ready to rotate</button>
                &nbsp;&nbsp;&nbsp;&nbsp;

                <span>Anchor Node: {anchorNode}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>Selected Node: {selectedNode}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;

                &nbsp;&nbsp;&nbsp;&nbsp;
            </div>

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