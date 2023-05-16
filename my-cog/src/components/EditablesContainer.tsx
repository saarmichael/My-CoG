import { useContext, useEffect, useRef, useState } from "react";

import { GridProvider, GridContext, IGridFocusContext } from "../contexts/GridContext";
import { EditableGrid } from "./EditableGrid";
import { TextField } from "@mui/material";
import SlidingBar from "./SlidingBar";
import { fetchImage } from "../shared/RequestsService";
import "./EditableContainer.css";


const ImageSelector = () => {

    const { backImgList, setBackImgList,
        backgroundImg, setBackgroundImg } = useContext(GridContext) as IGridFocusContext;

    const refAzimuth = useRef<HTMLInputElement>(null);
    const refElevation = useRef<HTMLInputElement>(null);
    const refDistance = useRef<HTMLInputElement>(null);


    // useEffect(() => {
    //     // get the initial basic image and initialize the list with it
    //     const getImage = async () => {
    //         const image = await fetchImage(0, 0, 360);
    //         const imageName = "azimuth: 0, elevation: 0, distance: 360";
    //         setBackImgList(backImgList.set(imageName, image));
    //     }
    //     getImage();
    // }, []);


    // return a select element with all the images
    return (
        <>
            <select onChange={(e) => {
                const selectedImage = e.target.value;
                setBackgroundImg("url(" + selectedImage + ")");
            }}>
                {Array.from(backImgList.keys()).map((imageName) => {
                    return <option value={backImgList.get(imageName)}>{imageName}</option>
                })}

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
                const imageName = "azimuth: " + refAzimuth.current?.value +
                    ", elevation: " + refElevation.current?.value +
                    ", distance: " + refDistance.current?.value;
                setBackImgList(backImgList.set(imageName, image));
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

            <div className="image-selector">
                <ImageSelector />
            </div>

            <div className="sliding-bar-container">
                <SlidingBar
                    range={360}
                    onChange={(event, newValue) => {
                        const inputAngle = newValue[0] % 360;
                        setAngle(inputAngle);
                    }}
                    toSubmit={false}
                    keepDistance={false}
                />
                <TextField
                    type="number"
                    size="small"
                    label="Angle"
                    onChange={(event) => {
                        const inputAngle = Number(event.target.value) % 360;
                        setAngle(inputAngle);
                    }}
                />
            </div>

            <div className="button-container">
                <button
                    className="select-button"
                    title="Set Anchor Node"
                    onClick={() => {
                        setAnchorNode(selectedNode);
                    }}
                >
                    Select Node
                </button>

                <button
                    className="move-button"
                    title="Apply Move"
                    onClick={() => {
                        setApplyMove([...applyMove]);
                    }}
                >
                    Move
                </button>

                <button
                    className="rotate-button"
                    title="Set for Rotation"
                    onClick={() => {
                        setRotationReady(true);
                    }}
                >
                    Ready to Rotate
                </button>

                <span className="node-info">
                    Anchor Node: {anchorNode}
                </span>
                <span className="node-info">
                    Selected Node: {selectedNode}
                </span>
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