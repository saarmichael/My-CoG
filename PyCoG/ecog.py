import numpy as np
from scipy.signal import spectrogram
from matplotlib import pyplot as plt

# Generate synthetic ECoG data
time = np.linspace(0, 10, 1000)  # Time axis
frequency = np.logspace(1, 2, 100)  # Frequency axis
data = np.random.randn(len(time), len(frequency))  # ECoG data

# Preprocess the data
data -= np.mean(data, axis=0)  # Subtract the mean across time
data /= np.std(data, axis=0)  # Normalize each frequency band

# Compute spectrogram of the ECoG data
frequencies, times, spectrogram_data = spectrogram(data, fs=1.0 / np.mean(np.diff))

# Perform further analysis on the spectrogram
max_power_freq = frequencies[
    np.argmax(np.max(spectrogram_data, axis=1))
]  # Find frequency with maximum power
mean_power_time = np.mean(spectrogram_data, axis=0)  # Compute mean power across time

# Visualize the results
plt.figure(figsize=(10, 6))
plt.imshow(
    spectrogram_data,
    aspect="auto",
    origin="lower",
    cmap="inferno",
    extent=[times[0], times[-1], frequencies[0], frequencies[-1]],
)
plt.colorbar(label="Power")
plt.xlabel("Time (s)")
plt.ylabel("Frequency (Hz)")
plt.title("Spectrogram of ECoG Data")
plt.show()
