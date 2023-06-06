import { useContext, useEffect, useRef, useState } from "react";

import { GridProvider, GridContext, IGridFocusContext } from "../contexts/GridContext";
import { EditableGrid } from "./EditableGrid";
import { Grid, TextField } from "@mui/material";
import SlidingBar from "./SlidingBar";
import { fetchImage } from "../shared/RequestsService";
import "./EditableContainer.css";
import SimpleCard from "../scenes/global/SimpleCard";


const ImageSelector = () => {

    const { backImgList, setBackImgList,
        backgroundImg, setBackgroundImg } = useContext(GridContext) as IGridFocusContext;

    const refAzimuth = useRef<HTMLInputElement>(null);
    const refElevation = useRef<HTMLInputElement>(null);
    const refDistance = useRef<HTMLInputElement>(null);


    // return a select element with all the images
    return (
        <>
            <Grid container direction="column" alignItems="center" spacing={2}>
                <Grid item>
                    <TextField inputRef={refAzimuth} type="number" size="small" label={"azimuth"} />
                </Grid>
                <Grid item>
                    <TextField inputRef={refElevation} type="number" size="small" label={"elevation"} />
                </Grid>
                <Grid item>
                    <TextField inputRef={refDistance} type="number" size="small" label={"distance"} />
                </Grid>
                <Grid item>
                    <div className="submit-button"
                        onClick={async () => {
                        const image = await fetchImage(
                            Number(refAzimuth.current?.value),
                            Number(refElevation.current?.value),
                            Number(refDistance.current?.value)
                        );
                        const imageName = "azimuth: " + refAzimuth.current?.value +
                            ", elevation: " + refElevation.current?.value +
                            ", distance: " + refDistance.current?.value;
                        setBackImgList(backImgList.set(imageName, image));
                        setBackgroundImg(`url(${image})`);
                    }}>Add Image</div>
                </Grid>
                <Grid item>
                    <SimpleCard content={<>Recent files</>} />
                </Grid>
                <Grid item>
                    <select onChange={(e) => {
                        const selectedImage = e.target.value;
                        setBackgroundImg(`url(${selectedImage})`);
                    }}>
                        {Array.from(backImgList.keys()).map((imageName) => {
                            return <option value={backImgList.get(imageName)}>{imageName}</option>
                        })}

                    </select>
                </Grid>
            </Grid>


        </>
    );

}

const Container = () => {


    const {
        setAngle,
        setRotationReady,
    } = useContext(GridContext) as IGridFocusContext;

    return (
        <>

            <h1>Editable Grid</h1>
            <Grid container>
                <Grid item xs={10} >
                    <EditableGrid N={4} M={3} />
                </Grid>
                <Grid item xs={2} alignItems="center">
                    <ImageSelector />
                </Grid>
                <Grid item xs={10} >
                    
                <SlidingBar
                    sliderName="Angle"
                    range={360}
                    onChange={(event, newValue) => {
                        const inputAngle = newValue[0] % 360;
                        setAngle(inputAngle);
                    }}
                    toSubmit={false}
                    keepDistance={false}
                />
                
                </Grid>
                <Grid container justifyContent="center" flexDirection="column">
                    <Grid item xs={12} >
                        <TextField
                            type="number"
                            size="small"
                            label="Angle"
                            onChange={(event) => {
                                const inputAngle = Number(event.target.value) % 360;
                                setAngle(inputAngle);
                            }}
                        />
                        </Grid>
                
                    <Grid item xs={12} >
                        <div className="button-container">

                            <button
                                className="rotate-button"
                                title="Set for Rotation"
                                onClick={() => {
                                    setRotationReady(true);
                                }}
                            >
                                <SimpleCard content={<>Ready to rotate</>} />

                            </button>

                        </div>
                    </Grid>
                </Grid>
            </Grid>
            



            
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