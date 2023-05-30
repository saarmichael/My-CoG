import mne_bids
import pandas as pd

import os


bids_root = r"C:\\Users\\saarm\\Code Projects\\BIDS\\AudioVisual"
os.chdir(bids_root)

# build BIDSPath to read ieeg data of subject 01, session postimp, task seizure, run 01, suffix ieeg
subject = "01"
session = "iemu"
task = "film"
run = "1"
acquisition = "clinical"
suffix = "ieeg"
datatype = "ieeg"
bids_path = mne_bids.BIDSPath(
    root=bids_root,
    subject=subject,
)
bids_path = mne_bids.get_bids_path_from_fname(
    "C:\\Users\\saarm\\Code Projects\\BIDS\\AudioVisual\\sub-01\\ses-iemu\\ieeg\\sub-01_ses-iemu_task-film_acq-clinical_run-1_ieeg"
)
# get the data from the bids_path
raw = mne_bids.read_raw_bids(bids_path=bids_path, verbose=False)
data = raw.get_data()
data = data.transpose()
print(data.shape)
tsv_path = bids_path.copy().update(suffix="channels", extension=".tsv").fpath
tsv_table = pd.read_table(tsv_path)
print(tsv_table)
# get a list of all names
names = tsv_table["name"].tolist()
print(names)
# get a list of the sampling rates
sampling_rates = tsv_table["sampling_frequency"].tolist()
print(sampling_rates)

print(bids_path.acquisition)

# channels_path = bids_path.copy().update(suffix="channels", extension=".tsv")
# print(channels_path)
# read the tsv file with the channels info and print it


# raw = read_raw_bids(bids_path=bids_path, verbose=False)

# # print(raw.info["subject_info"])
# # print(raw.info["line_freq"])
# # print(raw.info["sfreq"])
# # print(raw.annotations)
# raw.plot()
# x = input()
