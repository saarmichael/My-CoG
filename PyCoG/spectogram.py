import numpy as np
from scipy import signal

def normalize(array):
    return (array - np.mean(array)) / np.std(array)

# function to calculate the spectrogram of a signal using the Welch method
def spectogram(x, fs, window_size, overlap):
    # calculate the spectrogram
    f, t, Sxx = signal.spectrogram(x, fs, window='hann', nperseg=window_size, noverlap=overlap, scaling='spectrum')
    return f, t, Sxx
