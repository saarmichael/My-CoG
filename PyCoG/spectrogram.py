import numpy as np
from scipy import signal

def normalize(array):
    return (array - np.mean(array))

# function to calculate the spectrogram of a signal using the Welch method
def spectrogram(x, fs, window_size, overlap):
    # normalize the signal
    x = normalize(x)
    # calculate the spectrogram
    # takes small amount for faster tunetime
    f, t, Sxx = signal.spectrogram(x[:1000], fs=fs, window='hann', scaling='density')
    return f, t, Sxx.T

def spectrograms(Xs, fs, window_size, overlap):
    spectrograms = []
    for i in range(Xs.shape[1]):
        f, t, Sxx = spectrogram(Xs[:, i], fs, window_size, overlap)
        spectrograms.append(Sxx.T)
    return f, t, spectrograms
