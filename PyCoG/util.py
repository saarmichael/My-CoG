import glob
import os
from scipy.io import loadmat
from flask import session


def find_file(pattern, path):
    for file in glob.glob(f"{path}/**/{pattern}", recursive=True):
        return file


def get_data():
    data = loadmat(find_file(session["user_data_dir"], os.getcwd()))["data"]
    # special case for finger flex data
    if session["user_data_dir"].split("/")[-1] == "bp_fingerflex.mat":
            data = data[:, 0:10]
    return data
