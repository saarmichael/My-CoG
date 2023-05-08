from mne_bids import BIDSPath, read_raw_bids, print_dir_tree, mark_channels
import os


bids_root = r"C:\Users\saarm\Code Projects\BIDS\Epilepsy"
os.chdir(bids_root)

# build BIDSPath to read ieeg data of subject 01, session postimp, task seizure, run 01, suffix ieeg
subject = "RESP0059"
session = "SITUATION1A"
task = "acute"
# run = "01"
suffix = "ieeg"
datatype = "ieeg"
bids_path = BIDSPath(
    subject=subject,
    session=session,
    task=task,
    suffix=suffix,
    datatype=datatype,
    root=bids_root,
)
channels_path = bids_path.copy().update(suffix="channels", extension=".tsv")
print(channels_path)
# read the tsv file with the channels info and print it


raw = read_raw_bids(bids_path=bids_path, verbose=False)

# print(raw.info["subject_info"])
# print(raw.info["line_freq"])
# print(raw.info["sfreq"])
# print(raw.annotations)
raw.plot()
