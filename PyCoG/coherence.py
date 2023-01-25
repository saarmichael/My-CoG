# import scipy
from scipy import signal
import numpy as np
import matplotlib.pyplot as plt
# matlab loader
from scipy.io import loadmat
import os

# load the data
finger_bp = loadmat('bp_fingerflex.mat')
bp_data = finger_bp['data']
elec1 = bp_data[:, 0] # first electrode
elec2 = bp_data[:, 1] # second electrode

# save the current working directory
cwd = os.getcwd()
# move back one directory
os.chdir('..')
os.chdir('my-cog\src\ecog_data')
# delete the old files if they exist
if os.path.exists('elec1.json'):
    os.remove('elec1.json')
if os.path.exists('elec2.json'):
    os.remove('elec2.json')


# write the first 10000 samples to a json file as an array
with open('elec1.json', 'w') as f:
    f.write(str(elec1.tolist()))

# close the file
f.close()
# do the same for the second electrode
with open('elec2.json', 'w') as f:
    f.write(str(elec2.tolist()))

# close the file
f.close()

# move back to the original working directory
os.chdir(cwd)



rng = np.random.default_rng()

fs = 10e3
N = 1e5
amp = 20
freq = 1234.0
noise_power = 0.001 * fs / 2
time = np.arange(N) / fs
b, a = signal.butter(2, 0.25, 'low')
x = rng.normal(scale=np.sqrt(noise_power), size=time.shape)
y = signal.lfilter(b, a, x)
x += amp*np.sin(2*np.pi*freq*time)
y += rng.normal(scale=0.1*np.sqrt(noise_power), size=time.shape)
# shift the second array

# normalize the arrays
# x = x - np.mean(x)
# x2 = x2 - np.mean(x2)
# y = y - np.mean(y)
# x = x / np.std(x)
# x2 = x2 / np.sqrt(np.sum(x2**2))
# y = y / np.std(y)


# calculate the normalized cross-correlation
# corr = signal.correlate(x, y, mode='same') / np.sqrt(signal.correlate(x, x, mode='same')[500] * signal.correlate(y, y, mode='same')[500])
# timer for the correlation
# from timeit import default_timer as timer
# start = timer()

# # corr = signal.correlate(x, y, mode='same')
# # calculate the normalized cross-correlation
# corr = signal.correlate(x, y, mode='full')
# end = timer()

# f, Cxy = signal.coherence(x, y, 10e3, nperseg=1024)



# print(end - start)
# plt.subplot(2, 1, 1)
# plt.plot(f, Cxy)
# plt.xlabel('frequency [Hz]')
# plt.ylabel('Coherence')
# plt.subplot(2, 1, 2)
# plt.plot(x)
# plt.plot(y)

# # add legend
# plt.legend(['x', 'y', 'x2'])
# plt.title('Signals')

# plt.show()


