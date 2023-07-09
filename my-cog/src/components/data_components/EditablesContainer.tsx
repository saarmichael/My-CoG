import HeightIcon from '@mui/icons-material/Height';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import { Button, FormControl, Grid, InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalDataContext, IGlobalDataContext } from "../../contexts/ElectrodeFocusContext";
import { GridContext, GridProvider, IGridFocusContext } from "../../contexts/GridContext";
import { BrainImageParamsResponse } from "../../shared/Requests";
import { fetchImage, fetchImageParams } from "../../shared/RequestsService";
import ComponentScreenshot from "../tools_components/ComponentScreenshot";
import { SlidingBarOneTumb } from "../tools_components/SlidingBar";
import { useDropdownStyles } from "../tools_components/Styles";
import "./EditableContainer.css";
import { EditableGrid } from "./EditableGrid";
import { GraphAnimation } from "./GraphAnimation";


const ImageSelector = () => {

    const { backImgList, setBackImgList,
        setBackgroundImg } = useContext(GridContext) as IGridFocusContext;

    const [paramsLists, setParamsLists] = useState<BrainImageParamsResponse>(
        { azi_list: [0], ele_list: [0], dist_list: [300] })
    const [imageParamsIdxs, setImageParamsIdxs] = useState<{ azi_index: number, ele_index: number, dist_index: number }>(
        { azi_index: 0, ele_index: 0, dist_index: 0 });
    const [selectedImageName, setSelectedImageName] = useState<string>("");


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
        setBackImgList(backImgList.set(imageName, image));
        setSelectedImageName(imageName);
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

    const classes = useDropdownStyles();

    // return a select element with all the images
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <Button onClick={() => {
                setImageParamsIdxs({
                    azi_index: (imageParamsIdxs.azi_index + 1) % paramsLists.azi_list.length,
                    ele_index: imageParamsIdxs.ele_index,
                    dist_index: imageParamsIdxs.dist_index
                });
            }}>
                <HeightIcon sx={{ color: 'purple' }} />
            </Button>
            <span>{paramsLists.azi_list[imageParamsIdxs.azi_index]}</span>

            <Button onClick={() => {
                setImageParamsIdxs({
                    azi_index: imageParamsIdxs.azi_index,
                    ele_index: (imageParamsIdxs.ele_index + 1) % paramsLists.ele_list.length,
                    dist_index: imageParamsIdxs.dist_index
                });
            }}>
                <ThreeSixtyIcon sx={{ color: 'purple' }} />
            </Button>
            <span>{paramsLists.ele_list[imageParamsIdxs.ele_index]}</span>

            <Button onClick={() => {
                setImageParamsIdxs({
                    azi_index: imageParamsIdxs.azi_index,
                    ele_index: imageParamsIdxs.ele_index,
                    dist_index: (imageParamsIdxs.dist_index + 1) % paramsLists.dist_list.length
                });
            }}>
                <OpenWithIcon sx={{ color: 'purple' }} />
            </Button>
            <span>{paramsLists.dist_list[imageParamsIdxs.dist_index]}</span>

            <Button onClick={() => {
                fetchImage(0, 0, 400).then((image) => {
                    //setBackImgList(backImgList.set("default", image));
                    setBackgroundImg(`url(${image})`);
                }
                );
            }}>
            </Button>

            <FormControl>
                <InputLabel>Recent Images</InputLabel>
                <Select
                    className={classes.customDropdown}
                    value={selectedImageName}
                    onChange={(e) => {
                        const selectedImage = e.target.value;
                        setSelectedImageName(selectedImage);
                        const azimuth_value = selectedImage.split(",")[0].split(":")[1];
                        const elevation_value = selectedImage.split(",")[1].split(":")[1];
                        const distance_value = selectedImage.split(",")[2].split(":")[1];
                        setImageParamsIdxs({
                            azi_index: paramsLists.azi_list.indexOf(Number(azimuth_value)),
                            ele_index: paramsLists.ele_list.indexOf(Number(elevation_value)),
                            dist_index: paramsLists.dist_list.indexOf(Number(distance_value))
                        });
                        setBackgroundImg(`url(${backImgList.get(selectedImage)})`);
                    }}
                >

                    {Array.from(backImgList.keys()).map((imageName, index) => {
                        return (
                            <MenuItem key={index} value={imageName}>
                                {imageName}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </div>
    );

}

const Container = () => {


    const {
        setAngle,
    } = useContext(GridContext) as IGridFocusContext;
    const {
        isAnimating,
    } = useContext(GlobalDataContext) as IGlobalDataContext;

    return (
        <>

            <h1 className="head">Brain View</h1>
            <Grid container spacing={1}>
                <Grid item xs={10}>
                    <ComponentScreenshot content={<EditableGrid N={4} M={4} />} />
                </Grid>
                <Grid item xs={2}>
                    <ImageSelector />
                </Grid>

                <Grid item xs={10} >

                    <SlidingBarOneTumb
                        sliderName="Angle"
                        range={360}
                        onChange={(event, newValue) => {
                            const inputAngle = (newValue as number) % 360;
                            setAngle(inputAngle);
                        }}
                        keepDistance={false}
                        miniSlider={false}
                        disabled={isAnimating}
                    />

                </Grid>
                <Grid item xs={10}>
                    <GraphAnimation />
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
