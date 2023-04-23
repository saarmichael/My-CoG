import { GraphinData } from "@antv/graphin";
import { apiGET } from "./ServerRequests";
import { BasicGraphResponse } from "./Requests";

const baseAddress = "http://localhost:5000";

export const getBasicGraph = async () : Promise<BasicGraphResponse> => {
    const url = `${baseAddress}/graph`;
    return apiGET<BasicGraphResponse>(url);
}

export const getFrequencies = async () : Promise<number[]> => {
    const url = `${baseAddress}/frequencies`;
    return apiGET<number[]>(url);
}
