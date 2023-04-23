// import the data from the ecog_data dir
import coherence_matrices from './ecog_data/coherence_matrices.json';
import spectrograms from './ecog_data/spectrograms.json';
import coherence_over_time from './ecog_data/coherence_over_time.json';



export type SpectrogramData = {
    f: number[],
    t: number[],
    Sxx: number[][]
}

export type CoherenceMatrix = {
    freqs: number[];
    values: number[][];
};

export const getSpectrogramDataSync = (elecNum: number): SpectrogramData => {
    // parse the data from the json file spectrograms because it is very large
    let data = JSON.parse(JSON.stringify(spectrograms));
    let f = data.f;
    let t = data.t;
    let Sxx = data.spectrograms;
    return {f:f, t:t, Sxx:Sxx[elecNum]};
}

export const getSpectrogramData = async (elecNum: number): Promise<SpectrogramData> => {
    // read the data from the json file using fetch
    let data = await fetch('http://localhost:3000//spectrograms.json');
    let json = await data.json();
    let f = json.f;
    let t = json.t;
    let Sxx = json.spectrograms;
    return {f:f, t:t, Sxx:Sxx[elecNum]};
}




// get the whole data of the coherence matrices
export const getCoherenceMatrices = () => {
    return coherence_matrices;
};

export const getFrequenciesFromFile = () : number[] => {
    return coherence_matrices.f;
};

export const getFrequenciesTime = () : number[] => {
    return coherence_over_time.f;
};

// get the coherence matrix of a specific frequency band
export const getCoherenceMatrix = (freqBand: number): number[][] => {
    // freqBand is the key of the coherence matrix
    let f = coherence_matrices.f
    // find the index of the closest frequency band
    let index = f.findIndex((f) => f >= freqBand);
    // let index = f.reduce((prev, curr) => {
    //     return (Math.abs(curr - freqBand) < Math.abs(f[prev] - freqBand) ? curr : prev);
    // });

    // return the coherence matrix of the closest frequency band
    // make index an integer
    index = Math.round(index);
    return coherence_matrices.Cxy[index];
};

export const getTimeWindows = (): number[] => {
    return coherence_over_time.t;
}

export const getCoherenceOverTime = () => {
    return coherence_over_time;
};

export const getCoherenceByTime = (time: number) => {
    let t = coherence_over_time.t; // vector of time interval beginnings
    // find the index of the closest time using absolute value and difference of 0.5
    let index = t.findIndex((t) => Math.abs(t - time) < 0.5);
    index = Math.round(index);
    return coherence_over_time.coherence_matrices[index];
}

