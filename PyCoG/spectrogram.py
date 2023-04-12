import numpy as np
from scipy import signal

def normalize(array):
    return (array - np.mean(array))

# function to calculate the spectrogram of a signal using the Welch method
def spectrogram(x, fs, window_size, overlap):
    # trim the signal
    x = x[:10000]
    # normalize the signal
    x = normalize(x)
    # calculate the spectrogram
    f, t, Sxx = signal.spectrogram(x, fs=fs, window='hann', scaling='density')
    f, t, Sxx = signal.spectrogram(x, fs)

    fmax = 250 # Hz
    freq_slice = np.where((f >= 0) & (f <= fmax))

    # keep only frequencies of interest
    f   = f[freq_slice]
    Sxx = Sxx[freq_slice,:][0]

    return f, t, Sxx.T

def spectrograms(Xs, fs, window_size, overlap):
    spectrograms = []
    for i in range(Xs.shape[1]):
        f, t, Sxx = spectrogram(Xs[:, i], fs, window_size, overlap)
        spectrograms.append(Sxx.T)
    return f, t, spectrograms
