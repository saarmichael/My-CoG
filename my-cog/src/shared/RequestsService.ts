import { GraphinData } from "@antv/graphin";
import { FreqRange, TimeInterval } from './GraphRelated';
import { BasicGraphResponse, CoherenceResponse } from "./Requests";
import { apiGET } from "./ServerRequests";

const baseAddress = "http://localhost:5000";


let singletonGraph: GraphinData;
const coherenceMap = new Map<string, Promise<CoherenceResponse>>();
let singletonFrequencies: number[];
let singletonDuration: number;

export const getSingletonGraph = async (): Promise<GraphinData> => {
    if (!singletonGraph) {
        singletonGraph = await getBasicGraph();
    }
    return { ...singletonGraph };
}

export const getSingletonFreqList = async (): Promise<number[]> => {
    if (!singletonFrequencies) {
        singletonFrequencies = await getFrequencies();
    }
    return [...singletonFrequencies];
}

export const getSingletonDuration = async (): Promise<number> => {
    if (!singletonDuration) {
        singletonDuration = await getDuration();
    }
    return singletonDuration;
}

export const getCoherenceResponse =
    async (time?: TimeInterval): Promise<CoherenceResponse | undefined> => {
        let url = `${baseAddress}/time`;
        if (time) {
            url += `?start=${time.start}&end=${time.end}`;
        }
        if (!coherenceMap.has(url)) {
            coherenceMap.set(url, apiGET<CoherenceResponse>(url));
        }
        let response = coherenceMap.get(url);
        return response;
    }

export const getBasicGraph = async (): Promise<BasicGraphResponse> => {
    const url = `${baseAddress}/graph`;
    return apiGET<BasicGraphResponse>(url);
}

export const getFrequencies = async (): Promise<number[]> => {
    const url = `${baseAddress}/frequencies`;
    return apiGET<number[]>(url);
}

export const getDuration = async (): Promise<number> => {
    const url = `${baseAddress}/duration`;
    return apiGET<number>(url);
}

export const simpleGetRequest = async () => {
    const url = `${baseAddress}/`;
    apiGET<Response>(url)
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error(error))
}
