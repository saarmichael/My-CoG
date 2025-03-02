# import scipy
import time
from scipy import signal
import numpy as np
import concurrent.futures


def coherence(x, y, fs, window, overlap=0.5, nperseg=256):
    """
    Compute the coherence between two signals x and y.
    """
    f, Cxy = signal.coherence(
        x, y, fs=fs, window=window, noverlap=overlap, nperseg=nperseg
    )
    # now return only the part of f that corresponds to frequencies up to 250 Hz
    limit = 0
    for i in range(len(f)):
        if f[i] > 250:
            limit = i - 1
            break
    f = f[0:limit]
    Cxy = Cxy[0:limit]
    return f, Cxy


def get_synchronous_coherence_matrices(data, fs, window, overlap):
    f, _ = coherence(data[:, 0], data[:, 1], fs, window, overlap)
    # f is the frequency vector and CM is all the coherence matrices for each pair of electrodes and is number[][][]
    CM = np.zeros((len(f), data.shape[1], data.shape[1]))
    for i in range(data.shape[1]):
        for j in range(i + 1, data.shape[1]):
            f, Cxy = coherence(data[:, i], data[:, j], fs, window, overlap)
            CM[:, i, j] = Cxy
    return f, CM


def get_coherence_matrices(data, fs, window="hann", overlap=0.5, nperseg=256):
    """
    Compute the coherence between all pairs of electrodes in data.
    """
    f, _ = coherence(
        data[:, 0], data[:, 1], fs, window=window, overlap=overlap, nperseg=nperseg
    )

    def coherence_worker(i, j):
        _, Cxy = coherence(data[:, i], data[:, j], fs, window, overlap, nperseg=nperseg)
        return Cxy, i, j

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(coherence_worker, i, j)
            for i in range(data.shape[1])
            for j in range(i + 1, data.shape[1])
        ]
        results = [
            future.result() for future in concurrent.futures.as_completed(futures)
        ]

    CM = np.zeros((len(f), data.shape[1], data.shape[1]))
    for result in results:
        Cxy, i, j = result
        CM[:, i, j] = Cxy

    return f, CM


def get_coherence_squared_matrices(data, fs, window="hann", overlap=0.5, nperseg=256):
    f, CM = get_coherence_matrices(
        data, fs, window=window, overlap=overlap, nperseg=nperseg
    )
    CM = np.square(CM)
    return f, CM


# def write_CM_to_JSON(CM, filename):
#     """
#     Write the coherence matrices to a JSON file.
#     """
#     import json
#     with open(filename, 'w') as outfile:
#         json.dump(CM, outfile)


"""
    the goal of this/these function(s) is to compute the coherence OVER TIME:
    meaning that the output should be coherence matrices for each time window
"""


def coherence_over_time(data, fs, num_windows, time_overlap):
    # get the time duration of the data
    duration = (
        data.shape[0] / fs
    )  # num of samples / sampling rate = time duration in seconds
    # get the time duration of each window
    window_duration = duration / num_windows
    # get the number of samples in each window
    window_samples = int(window_duration * fs)
    # get the number of samples to overlap
    overlap_samples = int(time_overlap * fs)
    # get the number of samples to shift
    shift_samples = window_samples - overlap_samples
    # get the number of windows
    num_windows = int((data.shape[0] - overlap_samples) / shift_samples)
    # create a vector of the starting time of each window
    time = np.zeros(num_windows)
    for i in range(num_windows):
        time[i] = i * shift_samples / fs

    # calculate the amount of time in seconds of each window
    window_time = window_samples / fs

    # get the number of frequencies in the coherence calculation
    f, _ = coherence(data[:, 0], data[:, 1], fs, "hann", 0.5)
    num_freq = len(f)
    # create a 4D array to hold the coherence matrices for each window:
    #  1st dimension is the window number, 2nd dimension is the frequency, 3rd and 4th dimensions are the coherence matrix
    time_CM = np.zeros((num_windows, num_freq, data.shape[1], data.shape[1]))

    # for each window, compute the coherence matrix
    for i in range(num_windows):
        # get the start and end indices for the window
        start = i * shift_samples
        end = start + window_samples
        # get the coherence matrix for the window
        f, CM = get_coherence_matrices(data[start:end, :], fs, "hann", 0.5)
        # store the coherence matrix for the window
        time_CM[i, :, :] = CM

    return f, window_time, time, time_CM


"""
    calculate the coherence for a specific time frame
"""


def coherence_time_frame(data, fs, start=None, end=None, time_overlap=0.5):
    if start is None:
        start = 0
    if end is None:
        end = data.shape[0] / fs
    if start == end or start > end:
        end = data.shape[0] / fs
    start = float(start) * fs
    end = float(end) * fs
    stopwatch = time.time()
    f, CM = get_coherence_matrices(
        data[int(start) : int(end), :], fs, "hann", time_overlap
    )
    print(
        f"coherence_time_frame took {time.time() - stopwatch} seconds, for calculating {CM.shape} CM"
    )
    return f, CM


def get_recording_duration(data, fs):
    duration = data.shape[0] / fs
    return duration


def get_data_by_start_end(data, fs, start, end, resolution="s"):
    if start is None:
        start = 0
    if end is None:
        end = data.shape[0] / fs
    if float(start) == float(end) or float(start) > float(end):
        end = data.shape[0] / fs
    start = float(start) * fs
    end = float(end) * fs
    return data[int(start) : int(end), :]
