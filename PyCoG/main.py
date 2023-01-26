import numpy as np
import matplotlib.pyplot as plt
# matlab loader
from scipy.io import loadmat
from output import write_array, write_matrix
import os

# load the data
finger_bp = loadmat('bp_fingerflex.mat')
bp_data = finger_bp['data']
elec1 = bp_data[:, 0] # first electrode
elec2 = bp_data[:, 1] # second electrode

write_array(elec2, 'elec1.json')
write_array(elec1, 'elec2.json')

