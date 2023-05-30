import glob
import os
from scipy.io import loadmat
from flask import session

def find_file(pattern, path):
    for file in glob.glob(f'{path}/**/{pattern}', recursive=True):
        return file
    
def get_data():
    data =  loadmat(find_file(session["user_data_dir"], os.getcwd()))["data"]
    # special case for finger flex data
    if session["user_data_dir"].split("/")[-1] == "bp_fingerflex.mat":
            data = data[:, 0:10]
    return data

def convert_to_tree(path, prefix=""):
    children = []
    for i, sub_path in enumerate(glob.glob(os.path.join(path, '*'))):
        key = f"{prefix}{i}"
        if os.path.isdir(sub_path):
            children.append({
                "key": key,
                "label": os.path.basename(sub_path),
                "children": convert_to_tree(sub_path, prefix=f"{key}-"),
                "isFile": False
            })
        else:
            # check if files ends with .eeg
            if sub_path.endswith(".eeg"):
                children.append({
                    "key": key,
                    "label": os.path.basename(sub_path),
                    "children": [],
                    "isFile": True
                })
    return children

def convert_path_to_tree(path):
    return convert_to_tree(path, prefix="")


