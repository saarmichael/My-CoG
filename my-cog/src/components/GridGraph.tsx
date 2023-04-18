import Graphin, { GraphinData } from "@antv/graphin"
import { getSimpleGraphinData } from "../shared/GraphService";
import { useState } from "react";
import { useEffect } from "react";
import { type } from "os";
import { brainImages } from "../shared/brainImages";



export const GridGraph = () => {

    const [backgroundImg, setBackgroundImg] = useState<string>("url(" + brainImages[0].url + ")");

    const selectBackgroundImage = (
        <select onChange={(e) => {
            setBackgroundImg("url(" + brainImages[Number(e.target.value)].url+ ")");
        }}>
            {brainImages.map((img, index) => {
                return <option key={index} value={index}>{img.title}</option>
            })}
        </select>
    )

    const createGraphData = () => {
        // create the nodes and edges using GraphService module
        let graph: GraphinData;
        graph = getSimpleGraphinData();
        return graph;
    }
    const [state, setState] = useState<GraphinData>(createGraphData());

    useEffect(() => {
        setState(createGraphData());
    }, []);

    createGraphData();
    const data = state;

    return (
        <>
            {selectBackgroundImage}
            <Graphin data={data} layout={{ type: 'grid' }}
                style={{ backgroundImage: backgroundImg, backgroundPosition: 'center' }}
            />
        </>
    )

}