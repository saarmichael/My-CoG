import numpy as np
import matplotlib.pyplot as plt
# matlab loader
from scipy.io import loadmat
from output import *
from spectrogram import spectrogram
from coherence import get_coherence_matrices
import os

# load the data
finger_bp = loadmat('bp_fingerflex.mat')
bp_data = finger_bp['data']
bp_data = bp_data[:, 0:3]
elec1 = bp_data[:, 0] # first electrode
elec2 = bp_data[:, 1] # second electrode

# write_array(elec2, 'elec1.json')
# write_array(elec1, 'elec2.json')

# get the coherence matrices
f, CM = get_coherence_matrices(bp_data, 1000, 'hann', 0.5)
write_coherence_matrices(f, CM, 'coherence_matrices.json')

f, t, Sxx = spectrogram(elec1, 1000, 1000, 200)
write_spectrogram(t, f, Sxx, file_name='elec1_spectrogram')
