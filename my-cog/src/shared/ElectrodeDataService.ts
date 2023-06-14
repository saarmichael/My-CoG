import { Point } from "@arction/lcjs";
import { apiGET } from "./ServerRequests";
import { TimeInterval } from "./GraphRelated";


export interface TimeSeriesData {
    series: number[];
}


export const getTimeSeries = async (elecName: string, times: TimeInterval) => {
    let reso = times.resolution;
    if(reso === undefined) {
        reso = 's';
    }
    const url = `/timeSeries?elecName=${elecName}&start=${times.start}&end=${times.end}&resolution=${reso}`;
    const series = await apiGET<Point[]>(url, 'json');

    return series;
}
