# import scipy
from scipy import signal
import numpy as np
import matplotlib.pyplot as plt
# matlab loader
from scipy.io import loadmat

# load the data
finger_bp = loadmat('bp_fingerflex.mat')
finger_cc = loadmat('cc_fingerflex.mat')
finger_ht = loadmat('ht_fingerflex.mat')
finger_jc = loadmat('jc_fingerflex.mat')
# x = finger1['data'][:, 0]
# y = finger1['data'][:, 1]


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
from timeit import default_timer as timer
start = timer()

# corr = signal.correlate(x, y, mode='same')
# calculate the normalized cross-correlation
corr = signal.correlate(x, y, mode='full')
end = timer()

f, Cxy = signal.coherence(x, y, 10e3, nperseg=1024)



print(end - start)
plt.subplot(2, 1, 1)
plt.plot(f, Cxy)
plt.xlabel('frequency [Hz]')
plt.ylabel('Coherence')
plt.subplot(2, 1, 2)
plt.plot(x)
plt.plot(y)

# add legend
plt.legend(['x', 'y', 'x2'])
plt.title('Signals')

plt.show()


