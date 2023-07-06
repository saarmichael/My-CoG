import ast
from datetime import datetime
import math
import os
from flask import jsonify, request, send_file, session

from src.main.tools.export_data import export_connectivity_to_mat
from src.main.tools.video import graph_video
from src.main.tools.image_generator import get_azi_ele_dist_lists, get_brain_image
from src.main.analysis.granger import calculate_granger_for_all_pairs
from src.main.analysis.coherence import (
    coherence_time_frame,
    get_data_by_start_end,
    get_recording_duration,
)
from src.main.tools.consts import bcolors
from src.main.tools.db_write import DB_manager
from src.models.calculation import Calculation
from src.main.tools.bids_handler import (
    convert_path_to_tree,
    dataProvider,
    find_file,
    find_first_eeg_file,
)
from src.main.tools.cache_check import data_in_db, user_in_db
from src.main import bp
from src.models.user import User
from src.main.analysis.connectivity import Connectivity as Conn


class requestManager:
    def __init__(self, session) -> None:
        self.session = session
        self.data_provider = dataProvider(session)
        self.db_manager = DB_manager()

    def login(self, name):
        user = user_in_db(name, User.query)
        if not user:
            return jsonify({"message": "No user found!"}), 404
        # return user's data directory
        self.session.permanent = True
        self.session["user_root_dir"] = user.user_root_dir
        # get the parent directory of routes.py
        directory = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
        self.session["user_data_dir"] = find_first_eeg_file(
            find_file(user.user_root_dir, directory)
        )
        self.session["username"] = user.username
        self.data_provider = dataProvider(self.session)
        return jsonify(
            {"user_data_dir": self.session["user_data_dir"].split(os.sep)[-1]}
        )

    def get_settings(self):
        if not "username" in self.session:
            return jsonify({"message": "Session error"}), 400
        user = user_in_db(self.session["username"], User.query)
        return jsonify(user.settings)

    def get_frequencies(self):
        file = self.data_provider.get_data()
        sfreq = self.data_provider.get_sampling_rate()
        f, _ = coherence_time_frame(file, sfreq, 0, 1)
        return jsonify(f.tolist())

    def get_time_range(self):
        data = self.data_provider.get_data()
        sfreq = self.data_provider.get_sampling_rate()
        result = get_recording_duration(data, sfreq)
        return jsonify(result)

    def get_files(self):
        directory = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
        return jsonify(
            convert_path_to_tree(find_file(self.session["user_root_dir"], directory))
        )

    def get_file(self):
        return jsonify(self.session["user_data_dir"].split(os.sep)[-1])

    def get_connectivity_matrices(
        self, request, connectivity_name, start, end, overlap, nperseg
    ):
        data = self.data_provider.get_data()
        sfreq = self.data_provider.get_sampling_rate()
        data = get_data_by_start_end(data, sfreq, start, end)
        # Conn.get_connectivity_function(connectivity_name) is the connectivity function
        connectivity_function = Conn.get_connectivity_function(connectivity_name)
        f, CM = connectivity_function(
            data, sfreq, overlap=overlap, nperseg=nperseg
        )  # this is where the actual calculation happens
        result = {"f": f.tolist(), "CM": CM.tolist()}
        self.db_manager.write_calculation(
            self.session["user_data_dir"], request.url, result, self.session["username"]
        )
        return jsonify(result)

    def granger(self):
        data = self.data_provider.get_data()
        result = calculate_granger_for_all_pairs(data)  # calculate Granger causality
        return jsonify(result)  # return the result as JSON

    def get_time_series(self, channel_name, start, end, resolution, url):
        XY = self.data_provider.get_channel_data(
            channel_name, start=start, end=end, resolution=resolution
        )
        self.db_manager.write_calculation(
            file_name=self.session["user_data_dir"],
            url=url,
            data=XY,
            created_by=self.session["username"],
        )
        return jsonify(XY), 200

    def get_graph_basic_info(self):
        # get the number of nodes according to "coherence_over_time.json" file
        # open the json file and get the value of "coherence_matrices" key
        data = self.data_provider.get_data()
        channel_names = self.data_provider.get_channel_names()
        num_nodes = data.shape[1]
        # create the ids and labels.
        nodes = []
        for i in range(num_nodes):
            nodes.append(
                {
                    "id": channel_names[i],
                    "style": {"label": {"value": channel_names[i]}},
                }
            )
        # create the edges. theres an edge between every node
        edges = []
        for i in range(num_nodes):
            for j in range(i + 1, num_nodes):
                edges.append(
                    {
                        "id": channel_names[i] + "-" + channel_names[j],
                        "source": channel_names[i],
                        "target": channel_names[j],
                    }
                )
        layout = "circular"
        # return the result
        print(
            f"{bcolors.GETREQUEST}graph returned with {num_nodes} nodes and {len(edges)} edges{bcolors.ENDC}"
        )
        return jsonify({"layout": layout, "nodes": nodes, "edges": edges})

    def logout(self):
        if "username" in self.session:
            print(
                f"{bcolors.GETREQUEST}user logged out: {self.session['username']}{bcolors.ENDC}"
            )
            self.session.pop("username", None)
            self.session.pop("user_root_dir", None)
            self.session.pop("user_data_dir", None)
            return jsonify({"message": "Logged out successfully!"})
        return jsonify({"message": "No user logged in!"}), 400

    def brain_image(self, azi, ele, dis):
        # the fields are azimuth, elevation, and distance
        print(f"{bcolors.DEBUG}azi: {azi}, ele: {ele}, dis: {dis}{bcolors.ENDC}")
        # build file name
        folder_dir = os.path.abspath((os.path.dirname(__file__)))
        file_name = (
            folder_dir
            + "/tools/brain_images/"
            + "brain_image-azi_{}_ele_{}_dist_{}.png".format(azi, ele, dis)
        )
        return file_name

    def get_image_params(self):
        azi_list, rot_list, ele_list = get_azi_ele_dist_lists()
        return (
            jsonify(
                {
                    "azi_list": sorted(azi_list),
                    "ele_list": sorted(rot_list),
                    "dist_list": sorted(ele_list),
                }
            ),
            200,
        )

    def connectivity_list(self):
        return jsonify(Conn.get_connectivity_list()), 200

    def register(self, request):
        data = request.get_json()
        print(f'user:{data["username"]}.')
        # check if user exists
        if data["username"] == "":
            return jsonify({"message": "Username cannot be empty!"}), 400
        if user_in_db(data["username"], User.query):
            return jsonify({"message": "User already exists!"}), 400
        self.db_manager.write_user(data["username"], data["data"], data["settings"])
        return jsonify({"message": "User created successfully!"})

    def add_file(self, request):
        data = request.get_json()
        self.db_manager.update_data_dir(self.session["username"], data["file"])
        return jsonify({"message": "File added successfully!"})

    def save_settings(self, request):
        data = request.get_json()
        # check if user exists
        if not "username" in self.session:
            return jsonify({"message": "Session error"}), 400
        self.db_manager.write_settings(self.session["username"], data)
        return jsonify({"message": "Settings saved successfully!"})

    def set_file(self, request):
        print(self.session["user_data_dir"])
        directory = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
        self.session["user_data_dir"] = find_file(request.get_json()["file"], directory)
        return jsonify({"message": "File set successfully!"})

    def get_graph_video(self, request):
        request_data = request.get_json()
        data = self.data_provider.get_data()
        sfreq = self.data_provider.get_sampling_rate()
        channels = self.data_provider.get_channel_names()
        duration = request_data["duration"]
        video_name = request_data["videoName"]
        video = graph_video(
            data, channels, sfreq, duration, video_name, epoch_duration=0.5
        )
        return jsonify({"message": "Video created successfully!"})

    def export_data(self, start, end, resolution, file_name, connectivity_measure):
        if not os.path.isdir("exported_mat"):
            os.mkdir("exported_mat")

        date_time = datetime.now().strftime("%m-%d-%Y_%H-%M-%S")

        if not file_name:
            file_name = self.session["username"] + "_" + date_time

        file_name = "exported_mat/" + file_name
        # check if file is already exists
        if os.path.isfile(file_name + ".mat"):
            return jsonify({"message": "File already exists!"}), 400
        data = self.data_provider.get_data()
        sfreq = self.data_provider.get_sampling_rate()
        data = get_data_by_start_end(data=data, fs=sfreq, start=start, end=end)
        electrodes = self.data_provider.get_channel_names()
        bids_file_name = self.session["user_data_dir"].split(os.sep)[-1]
        meta_data = {
            "bids_file_name": bids_file_name,
            "electrodes": electrodes,
            "connectivity_measure": connectivity_measure,
            "date_time": date_time,
        }
        connectivity_func = Conn.get_connectivity_function(connectivity_measure)
        export_connectivity_to_mat(
            conn_func=connectivity_func,
            name=file_name,
            data=data,
            sfreq=sfreq,
            start=start,
            end=end,
            meta_data=meta_data,
        )
        # do something with data
        return jsonify({"message": "Data exported successfully!"}), 200
