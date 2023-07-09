import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from src.main.analysis.coherence import *


X = np.sin(np.linspace(0, 10, 1000)) + np.sin(np.linspace(0, 20, 1000))
Y = np.sin(np.linspace(0, 10, 1000)) + np.sin(np.linspace(0, 20, 1000))
# inequal signal
Z = (
    np.sin(np.linspace(0, 10, 1000))
    + np.sin(np.linspace(0, 20, 1000))
    + np.sin(np.linspace(0, 30, 1000))
)


def coherence_test_assist(Cxy1, Cxy2):
    for i in range(len(Cxy1)):
        if np.abs(Cxy1[i] - Cxy2[i]) > 0.02:
            return False
    return True


def test_coherence():
    f, Cxy = coherence(X, Y, fs=1000, window="hann", overlap=0.5, nperseg=256)
    t1 = coherence_test_assist(Cxy, np.ones(len(Cxy)))
    f, Cxz = coherence(X, Z, fs=1000, window="hann", overlap=0.5, nperseg=256)
    t2 = coherence_test_assist(Cxz, np.ones(len(Cxz)))
    assert t1 == True
    assert t2 == False


def test_signal_start_end():
    # group x, y, z into one matrix
    XYZ = np.array([X, Y, Z]).T
    trimmed = get_data_by_start_end(XYZ, fs=1000, start=0, end=0.5, resolution="s")
    cut_X = trimmed[:, 0]
    t1 = True
    t_X = X[0:500]
    for i in range(len(cut_X)):
        if cut_X[i] != t_X[i]:
            t1 = False
    trimmed = get_data_by_start_end(XYZ, fs=1000, start=0.25, end=0.75, resolution="s")
    cut_Y = trimmed[:, 1]
    t_Y = Y[250:750]
    t2 = True
    for i in range(len(cut_Y)):
        if cut_Y[i] != t_Y[i]:
            t2 = False
    assert t1 == True
    assert t2 == True
