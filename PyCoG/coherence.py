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
    f, _ = coherence(data[:, 0], data[:, 1], fs, window, overlap)
    # f is the frequency vector and CM is all the coherence matrices for each pair of electrodes and is number[][][]
    CM = np.zeros((len(f), data.shape[1], data.shape[1]))
    for i in range(data.shape[1]):
        for j in range(data.shape[1]):
            f, Cxy = coherence(data[:, i], data[:, j], fs, window, overlap)
            CM[:, i, j] = Cxy
    return f, CM

# def write_CM_to_JSON(CM, filename):
#     """
#     Write the coherence matrices to a JSON file.
#     """
#     import json
#     with open(filename, 'w') as outfile:
#         json.dump(CM, outfile)


