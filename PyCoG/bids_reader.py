from mne_bids import BIDSPath, read_raw_bids

import os


bids_root = r"C:\Users\saarm\Code Projects\BIDS\AudioVisual"
os.chdir(bids_root)

# build BIDSPath to read ieeg data of subject 01, session postimp, task seizure, run 01, suffix ieeg
subject = "01"
session = "iemu"
task = "film"
run = "1"
acquisition = "clinical"
suffix = "ieeg"
datatype = "ieeg"
bids_path = BIDSPath(
    root=bids_root,
    subject=subject,
    session=session,
    task=task,
    acquisition=acquisition,
    suffix=suffix,
    datatype=datatype,
    run=run,
)
# channels_path = bids_path.copy().update(suffix="channels", extension=".tsv")
# print(channels_path)
# read the tsv file with the channels info and print it


raw = read_raw_bids(bids_path=bids_path, verbose=False)

# print(raw.info["subject_info"])
# print(raw.info["line_freq"])
# print(raw.info["sfreq"])
# print(raw.annotations)
raw.plot()
x = input()
