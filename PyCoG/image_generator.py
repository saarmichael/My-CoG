import matplotlib
import matplotlib.pyplot as plt
from matplotlib.cm import ScalarMappable
from matplotlib.colors import Normalize

matplotlib.use("Agg")

import mne
from mne.datasets import sample


def get_brain_image(file_name, azimuth=0, elevation=90, distance=360, **kwargs):
    print(__doc__)

    data_path = sample.data_path()
    subjects_dir = data_path / "subjects"
    sample_dir = data_path / "MEG" / "sample"
    stc = mne.read_source_estimate(sample_dir / "sample_audvis-meg")
    stc.crop(0.09, 0.1)

    brain_kwargs = dict(alpha=0.8, background="white", cortex="low_contrast")
    brain = mne.viz.Brain("sample", subjects_dir=subjects_dir, **brain_kwargs)

    brain.show_view(
        azimuth=int(azimuth), elevation=int(elevation), distance=int(distance)
    )
    brain.save_image(file_name, mode="rgb")
    return
