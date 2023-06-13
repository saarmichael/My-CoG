import glob
import os
from scipy.io import loadmat
from flask import session
import mne_bids
import pandas as pd
import threading


class dataProvider:
    def __init__(self, session) -> None:
        self.bids_path = None
        self.channel_names = None
        self.sampling_rate = None
        self.session = session
        self.duration = None
        self.lock = threading.Lock()

    def set_session(self, session):
        self.session = session

    def get_session(self):
        return self.session

    def get_bids_path(self):
        if self.session == None:
            print("session is None")
            return None

        if self.bids_path == None:
            self.bids_path = mne_bids.get_bids_path_from_fname(
                self.session["user_data_dir"]
            )
        return self.bids_path

    def get_channel_names(self):
        if self.session == None:
            print("session is None")
            return None
        if self.channel_names == None:
            tsv_path = (
                self.get_bids_path()
                .copy()
                .update(suffix="channels", extension=".tsv")
                .fpath
            )
            tsv_table = pd.read_table(tsv_path)
            # get a list of all names
            self.channel_names = tsv_table["name"].tolist()
        return self.channel_names

    def get_sampling_rate(self):
        if self.session == None:
            print("session is None")
            return None
        with self.lock:
            if self.sampling_rate == None:
                tsv_path = (
                    self.get_bids_path()
                    .copy()
                    .update(suffix="channels", extension=".tsv")
                    .fpath
                )
                tsv_table = pd.read_table(tsv_path)
                # get a list of the sampling rates
                self.sampling_rate = tsv_table["sampling_frequency"].tolist()[0]

        return self.sampling_rate

    def get_duration(self):
        if self.session == None:
            print("session is None")
            return None
        with self.lock:
            if self.duration == None:
                raw = mne_bids.read_raw_bids(bids_path=self.bids_path, verbose=False)
                self.duration = raw.n_times / raw.info["sfreq"]

        return self.duration

    def get_data(self):
        with self.lock:
            if self.bids_path == None:
                file_name = self.session["user_data_dir"]
                # get rid of the .eeg suffix
                file_name = file_name.split(".")[0]
                self.bids_path = mne_bids.get_bids_path_from_fname(file_name)

        # load the raw data from the bids path
        raw = mne_bids.read_raw_bids(bids_path=self.bids_path, verbose=False)
        with self.lock:
            if self.duration == None:
                # update here already because why not
                self.duration = raw.n_times / raw.info["sfreq"]

        # get the data from the bids_path
        data = raw.get_data()
        # traspose the data so that the channels are the columns
        data = data.transpose()

        return data[:, 0:16]


def convert_to_tree(path, prefix=""):
    children = []
    for i, sub_path in enumerate(glob.glob(os.path.join(path, "*"))):
        key = f"{prefix}{i}"
        if os.path.isdir(sub_path):
            children.append(
                {
                    "key": key,
                    "label": os.path.basename(sub_path),
                    "children": convert_to_tree(sub_path, prefix=f"{key}-"),
                    "isFile": False,
                }
            )
        else:
            # check if files ends with .eeg
            if sub_path.endswith(".eeg"):
                children.append(
                    {
                        "key": key,
                        "label": os.path.basename(sub_path),
                        "children": [],
                        "isFile": True,
                    }
                )
    return children


def convert_path_to_tree(path):
    return convert_to_tree(path, prefix="")


def convert_to_tree(path, prefix=""):
    children = []
    for i, sub_path in enumerate(glob.glob(os.path.join(path, "*"))):
        key = f"{prefix}{i}"
        if os.path.isdir(sub_path):
            children.append(
                {
                    "key": key,
                    "label": os.path.basename(sub_path),
                    "children": convert_to_tree(sub_path, prefix=f"{key}-"),
                    "isFile": False,
                }
            )
        else:
            # check if files ends with .eeg
            if sub_path.endswith(".eeg"):
                children.append(
                    {
                        "key": key,
                        "label": os.path.basename(sub_path),
                        "children": [],
                        "isFile": True,
                    }
                )
    return children


def convert_path_to_tree(path):
    return convert_to_tree(path, prefix="")


def find_file(pattern, path):
    for file in glob.glob(f"{path}/**/{pattern}", recursive=True):
        return file


def find_first_eeg_file(directory):
    for filepath in glob.iglob(directory + "/**/*.eeg", recursive=True):
        return filepath

    return None
