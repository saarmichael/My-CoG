import os
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.cm import ScalarMappable
from matplotlib.colors import Normalize
import mne
from mne.datasets import sample


def get_azi_ele_dist_lists():
    azi_list = set()
    ele_list = set()
    dist_list = set()
    # check if you are in PyCoG
    if os.getcwd().endswith("PyCoG"):
        os.chdir("flask_app/src/main/tools")
    # check if the directory exists
    if not os.path.exists("brain_images"):
        os.mkdir("brain_images")
    # iterate over the files in the /brain_images directory
    os.chdir("brain_images")
    for file in os.listdir():
        if file.endswith(".png"):
            file_name = file.split(".")[0]
            file_name = file_name.split("-")[1]
            file_name = file_name.split("_")
            azi_list.add(int(file_name[1]))
            ele_list.add(int(file_name[3]))
            dist_list.add(int(file_name[5]))
    os.chdir("..")
    return (list(azi_list)), (list(ele_list)), (list(dist_list))


def generate_image(file_name, brain, azi, ele, dist):
    brain.show_view(roll=int(ele), elevation=int(azi), distance=int(dist))
    brain.save_image(file_name, mode="rgb")


def get_brain_image():
    print(__doc__)

    data_path = sample.data_path()
    subjects_dir = data_path / "subjects"
    sample_dir = data_path / "MEG" / "sample"
    stc = mne.read_source_estimate(sample_dir / "sample_audvis-meg")
    stc.crop(0.09, 0.1)

    brain_kwargs = dict(alpha=0.8, background="white", cortex="low_contrast")
    brain = mne.viz.Brain("sample", subjects_dir=subjects_dir, **brain_kwargs)

    return brain


def create_tons_of_images():
    os.chdir(
        "C:\\Users\\saarm\\Code Projects\\My-CoG\\PyCoG\\flask_app\\src\\main\\tools\\brain_images"
    )
    brain = get_brain_image()
    azi_list = [0, 90, 180]
    ele_list = [0, 90, 180, 270]
    dist_list = [300, 360, 400, 450]
    for azi in azi_list:
        for ele in ele_list:
            for dist in dist_list:
                file_name = "brain_image-azi_{}_ele_{}_dist_{}.png".format(
                    azi, ele, dist
                )
                generate_image(file_name, brain, azi, ele, dist)
    os.chdir("..")


# create_tons_of_images()
# azi_list, ele_list, dist_list = get_azi_ele_dist_lists()
