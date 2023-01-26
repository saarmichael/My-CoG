import numpy as np
import matplotlib.pyplot as plt
# matlab loader
from scipy.io import loadmat
from output import write_array, write_matrix, write_spectrogram
from spectrogram import spectrogram
import os

# load the data
finger_bp = loadmat('bp_fingerflex.mat')
bp_data = finger_bp['data']
elec1 = bp_data[:, 0] # first electrode
elec2 = bp_data[:, 1] # second electrode

# write_array(elec2, 'elec1.json')
# write_array(elec1, 'elec2.json')

# create a sine wave with frequencies of 2, 5, 10, 25, 100 Hz
fs = 1000
N = 10000
time = np.arange(N) / fs
freqs = [2, 5, 10, 25, 100]
sine_waves = []
for freq in freqs:
    sine_waves.append(np.sin(2*np.pi*freq*time))
x = np.sum(sine_waves, axis=0)

# get the spectrogram
f, t, Sxx = spectrogram(elec1, fs, 1000, 200)
write_spectrogram(t, f, Sxx, file_name='elec1_spectrogram')
# plot the spectrogram
plt.pcolormesh(t, f, Sxx)
plt.ylabel('Frequency [Hz]')
plt.xlabel('Time [sec]')
plt.show()


