// import the data from the ecog_data dir
import coherence_matrices from './ecog_data/coherence_matrices.json';

export type CoherenceMatrix = {
    freqs: number[];
    values: number[][];
};


// get the whole data of the coherence matrices
export const getCoherenceMatrices = () => {
    return coherence_matrices;
};

// get the coherence matrix of a specific frequency band
export const getCoherenceMatrix = (freqBand: number): number[][] => {
    // freqBand is the key of the coherence matrix
    let f = coherence_matrices.f
    // find the index of the closest frequency band
    let index = f.reduce((prev, curr) => {
        return (Math.abs(curr - freqBand) < Math.abs(f[prev] - freqBand) ? curr : prev);
    });
    // return the coherence matrix of the closest frequency band
    return coherence_matrices.Cxy[index];
};

