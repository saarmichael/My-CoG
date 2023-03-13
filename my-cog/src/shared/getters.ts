// import the data from the ecog_data dir
import coherence_matrices from './ecog_data/coherence_matrices.json';
import spectroData from './ecog_data/spectrograms.json';


export type SpectrogramData = {
    f: number[],
    t: number[],
    Sxx: number[][]
}

export type CoherenceMatrix = {
    freqs: number[];
    values: number[][];
};

export const getSpectrogramData = (elecNum: number): SpectrogramData => {
    return { spectroData.f, spectroData.t, spectroData.spectrograms[elecNum] };
}




// get the whole data of the coherence matrices
export const getCoherenceMatrices = () => {
    return coherence_matrices;
};

export const getFrequencies = () : number[] => {
    return coherence_matrices.f;
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

