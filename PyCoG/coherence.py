# import scipy
from scipy import signal
import numpy as np

def coherence(x, y, fs, window, overlap):
    """
    Compute the coherence between two signals x and y.
    """
    f, Cxy = signal.coherence(x, y, fs=fs, window=window, nperseg=256)
    return f, Cxy

def get_coherence_matrices(data, fs, window, overlap):
    """
    Compute the coherence between all pairs of electrodes in data.
    """
    # dict to hold the coherence matrices where keys are frequency bands
    coherence_matrices = {}
    # get the number of electrodes
    num_electrodes = data.shape[1]
    # get the frequencies and coherence values
    f, Cxy = coherence(data[:, 0], data[:, 1], fs, window, overlap)
    # get the number of frequency bands
    num_freq_bands = len(f)
    # create the coherence matrices
    for i in range(num_freq_bands):
        coherence_matrices[f[i]] = np.zeros((num_electrodes, num_electrodes))
    # fill in the coherence matrices
    for i in range(num_electrodes):
        for j in range(i+1, num_electrodes):
            f, Cxy = coherence(data[:, i], data[:, j], fs, window, overlap)
            for k in range(num_freq_bands):
                coherence_matrices[f[k]][i, j] = Cxy[k]
                coherence_matrices[f[k]][j, i] = Cxy[k]
    return coherence_matrices

# def write_CM_to_JSON(CM, filename):
#     """
#     Write the coherence matrices to a JSON file.
#     """
#     import json
#     with open(filename, 'w') as outfile:
#         json.dump(CM, outfile)


