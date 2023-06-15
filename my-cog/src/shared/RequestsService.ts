import { GraphinData } from "@antv/graphin";
import { ExportDataProps, FreqRange, TimeInterval } from './GraphRelated';
import { BasicGraphResponse, BrainImageParamsResponse, ConnectivityResponse } from "./Requests";
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

const cacheConnectivityResponse =
    async (connectivityName: string, time?: TimeInterval): Promise<ConnectivityResponse | undefined> => {
        let url = `${baseAddress}/cacheConnectivity`
        url += `?connectivity=${connectivityName}`;
        if (time) {
            url += `&start=${time.start}&end=${time.end}&nperseg=${time.samplesPerSegment}&overlap=${time.overlap}`;
        }
        return apiGET<ConnectivityResponse>(url);
    }


export const getConnectivityResponse =
    async (connectivityName: string, time?: TimeInterval): Promise<ConnectivityResponse | undefined> => {
        let url = `${baseAddress}/connectivity`
        url += `?connectivity=${connectivityName}`;
        if (time) {
            url += `&start=${time.start}&end=${time.end}&nperseg=${time.samplesPerSegment}&overlap=${time.overlap}`;
        }
        return apiGET<ConnectivityResponse>(url);
    }

export const cahceInServer = async (connectivityName: string, start: number, end: number, windowSize: number, overlap: number, nperseg: number): Promise<void> => {
    for (let i = start; i < end; i += windowSize) {
        const timeInter: TimeInterval = {
            start: i,
            end: i + windowSize,
            samplesPerSegment: nperseg,
            overlap: overlap
        }
        await cacheConnectivityResponse(connectivityName, timeInter);
    }
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

export const fetchImageParams = async () => {
    let url = `${baseAddress}/brainImageParamsList`;
    const response = await apiGET<BrainImageParamsResponse>(url);
    return response;
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

export const exportData = async (time: TimeInterval, connectivityMeasure?: string, fileName?: string) => {
    if (!connectivityMeasure) {
        connectivityMeasure = 'coherence';
    }
    const url = `/exportData`
    const response = await apiPOST<ExportDataProps>(url, { time: time, connectivityMeasure: connectivityMeasure, fileName: fileName });
    return response;
}

export const getConnectivityMeasuresList = async () => {
    const url = `/connectivityMeasuresList`;
    const response = await apiGET<string[]>(url);
    return response;
}
