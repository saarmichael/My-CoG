import numpy as np
from scipy import signal

def normalize(array):
    return (array - np.mean(array))

# function to calculate the spectrogram of a signal using the Welch method
def spectrogram(x, fs, window_size, overlap):
    # normalize the signal
    x = normalize(x)
    # calculate the spectrogram
    f, t, Sxx = signal.spectrogram(x, fs=fs, window='hann', scaling='density')
    return f, t, Sxx
