import { GraphinData } from "@antv/graphin";
import { ExportDataProps, FreqRange, TimeInterval } from './GraphRelated';
import { BasicGraphResponse, CoherenceResponse } from "./Requests";
import { ServerOption, apiGET, apiPOST } from "./ServerRequests";
import { Server } from "http";
import { IVisGraphOption } from "../contexts/VisualGraphOptionsContext";

const baseAddress = "http://localhost:5000";


let singletonGraph: GraphinData;
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
        const response = await apiGET<CoherenceResponse>(url);
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

export const fetchImage = async (azimuth: number, elevation: number, distance: number) => {
    let url = `${baseAddress}/brainImage?azimuth=${azimuth}&elevation=${elevation}&distance=${distance}`;
    const response = await apiGET<Blob>(url, 'blob');
    return URL.createObjectURL(response);
}

export const reorganizeOptions = (options: ServerOption[], realOptions: IVisGraphOption[]) => {
    let newOptions: IVisGraphOption[] = [];
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let realOption = realOptions.find((realOption) => realOption.label === option.label);
        if (realOption) {
            newOptions.push({ ...realOption, checked: option.checked });
        }
    }
    return newOptions;
}

export const exportData = async (time: TimeInterval, connectivityMeasure?: string) => {
    if(!connectivityMeasure) {
        connectivityMeasure = 'coherence';
    }
    const url = `/exportData`
    const response = await apiPOST<ExportDataProps>(url, {time: time, connectivityMeasure: connectivityMeasure});
    return response;
}
