// import the data from the ecog_data dir
import * as coherence_matrices from './ecog_data/coherence_matrices.json';

// get the whole data of the coherence matrices
export const getCoherenceMatrices = () => {
    return coherence_matrices;
};

// get the coherence matrix of a specific frequency band
export const getCoherenceMatrix = (freqBand: string) => {
    // freqBand is the key of the coherence matrix
   let key = "" ;
   for(const k in coherence_matrices){
       if(k === freqBand){
           return coherence_matrices[k];
       }
   }
};

