import { useContext, useEffect, useRef, useState } from "react";
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import { GridProvider, GridContext, IGridFocusContext } from "../contexts/GridContext";
import { EditableGrid } from "./EditableGrid";
import { Button, Grid, TextField } from "@mui/material";
import SlidingBar from "./SlidingBar";
import { fetchImage, fetchImageParams } from "../shared/RequestsService";
import "./EditableContainer.css";
import SimpleCard from "../scenes/global/SimpleCard";
import { BrainImageParamsResponse } from "../shared/Requests";


const ImageSelector = () => {

    const { backImgList, setBackImgList,
        backgroundImg, setBackgroundImg } = useContext(GridContext) as IGridFocusContext;

    const refAzimuth = useRef<HTMLInputElement>(null);
    const refElevation = useRef<HTMLInputElement>(null);
    const refDistance = useRef<HTMLInputElement>(null);
    const [paramsLists, setParamsLists] = useState<BrainImageParamsResponse>(
        { azi_list: [], ele_list: [], dist_list: [] })
    const [imageParamsIdxs, setImageParamsIdxs] = useState<{ azi_index: number, ele_index: number, dist_index: number }>(
        { azi_index: 0, ele_index: 0, dist_index: 0 });


    const fetchImg = async () => {
        const azimuth = paramsLists.azi_list[imageParamsIdxs.azi_index];
        const elevation = paramsLists.ele_list[imageParamsIdxs.ele_index];
        const distance = paramsLists.dist_list[imageParamsIdxs.dist_index];
        const image = await fetchImage(
            azimuth, elevation, distance
        );
        const imageName = "azimuth: " + azimuth +
            ", elevation: " + elevation +
            ", distance: " + distance;
        //setBackImgList(backImgList.set(imageName, image));
        setBackgroundImg(`url(${image})`);
    }

    useEffect(() => {
        const fetchParams = async () => {
            return fetchImageParams();
        }
        fetchParams().then((lists) => {
            setParamsLists(lists);
            setImageParamsIdxs({ azi_index: 0, ele_index: 0, dist_index: 0 });
        }).then(() => {
            fetchImg()
        });
    }, []);

    useEffect(() => {
        fetchImg();
    }, [imageParamsIdxs]);

    // return a select element with all the images
    return (
        <>
            <Grid container direction="column" alignItems="center" spacing={2}>
                <Grid item>
                    <Button onClick={() => {
                        setImageParamsIdxs({
                            azi_index: (imageParamsIdxs.azi_index + 1) % paramsLists.azi_list.length,
                            ele_index: imageParamsIdxs.ele_index,
                            dist_index: imageParamsIdxs.dist_index
                        });
                    }}>
                        <ThreeSixtyIcon />
                    </Button>
                    <span>{paramsLists.azi_list[imageParamsIdxs.azi_index]}</span>
                </Grid>
                <Grid item>
                    <Button onClick={() => {
                        setImageParamsIdxs({
                            azi_index: imageParamsIdxs.azi_index,
                            ele_index: (imageParamsIdxs.ele_index + 1) % paramsLists.ele_list.length,
                            dist_index: imageParamsIdxs.dist_index
                        });
                    }}>
                        <ThreeSixtyIcon />
                    </Button>
                    <span>{paramsLists.ele_list[imageParamsIdxs.ele_index]}</span>
                </Grid>
                <Grid item>
                    <Button onClick={() => {
                        setImageParamsIdxs({
                            azi_index: imageParamsIdxs.azi_index,
                            ele_index: imageParamsIdxs.ele_index,
                            dist_index: (imageParamsIdxs.dist_index + 1) % paramsLists.dist_list.length
                        });
                    }}>
                        <ThreeSixtyIcon />
                    </Button>
                    <span>{paramsLists.dist_list[imageParamsIdxs.dist_index]}</span>
                </Grid>
                <Grid >
                    <Button onClick={() => {
                        fetchImage(0, 0, 400).then((image) => {
                            //setBackImgList(backImgList.set("default", image));
                            setBackgroundImg(`url(${image})`);
                        }
                        );
                    }}>
                        <SimpleCard content={<>Fetch Image</>} />
                    </Button>
                </Grid>
                <Grid item>
                    <SimpleCard content={<>Recent Images</>} />
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
            </Grid >


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