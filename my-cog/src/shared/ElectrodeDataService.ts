import { Point } from "@arction/lcjs";
import { apiGET } from "./ServerRequests";


export interface TimeSeriesData {
    series: number[];
}


export const getTimeSeries = async (elecName: string) => {
    const url = `/timeSeries?elecName=${elecName}`;
    const series = await apiGET<Point[]>(url, 'json');

    return series;
}
