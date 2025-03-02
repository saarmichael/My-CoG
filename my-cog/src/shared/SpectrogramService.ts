import { getSpectrogramData, getSpectrogramDataSync, SpectrogramData } from './getters'


export const getData = async (electrodeID: string): Promise<SpectrogramData> => {
    // get the ID number alone parse it to a number
    const elecNum = parseInt(electrodeID[electrodeID.length - 1]);
    const data = await getSpectrogramData(elecNum);
    return data;
}

export const getDataSync = (electrodeID: string): SpectrogramData => {
    // get the ID number alone parse it to a number
    const elecNum = parseInt(electrodeID[electrodeID.length - 1]);
    const data = getSpectrogramDataSync(elecNum);
    return data;
}
