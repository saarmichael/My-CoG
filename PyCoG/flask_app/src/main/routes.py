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
from src.main.request_manager import requestManager

# @bp.before_first_request
# def create_tables():
#     db.create_all()
data_provider = dataProvider(session)
manager = requestManager(session=session)
db_manager = DB_manager()

###############################################
############### GET REQUESTS ##################
###############################################


@bp.route("/login", methods=["GET"])
def login():
    name = request.args.get("username")
    return manager.login(name)


@bp.route("/getSettings", methods=["GET"])
def get_settings():
    return manager.get_settings()


@bp.route("/frequencies", methods=["GET"])
def getFrequencies():
    return manager.get_frequencies()


@bp.route("/duration", methods=["GET"])
def get_time_range():
    return manager.get_time_range()


@bp.route("/getFiles", methods=["GET"])
def get_files():
    return manager.get_files()


@bp.route("/getFile", methods=["GET"])
def get_file():
    return manager.get_file()


# get_coherence_matrices
#   Parameters:
#       start: start time of the time frame
#       end: end time of the time frame
#   Returns:
#       f: frequency vector
#       CM: coherence matrix
#       the CM that corresponds to the time frame specified by the start and end parameters
@bp.route("/connectivity", methods=["GET"])
def get_connectivity_matrices():
    connectivity_name = request.args.get("connectivity")
    start = float(request.args.get("start"))
    end = float(request.args.get("end"))
    overlap = float(request.args.get("overlap"))
    nperseg = float(request.args.get("nperseg"))
    print(f"{bcolors.DEBUG}start: {start}, end: {end}{bcolors.ENDC}")
    file_name = session["user_data_dir"]
    cal = data_in_db(file_name, request.url, Calculation.query)
    if cal:
        return jsonify(cal.data)
    # error handling
    if start is None:
        start = 0
        # end will be the last time frame
    if end is None:
        end = 1
    if int(math.floor(float(start))) > int(math.floor(float(end))):
        end = str(int(start) + 1)
    return manager.get_connectivity_matrices(
        connectivity_name=connectivity_name,
        request=request,
        start=start,
        end=end,
        overlap=overlap,
        nperseg=nperseg,
    )


@bp.route("/cacheConnectivity", methods=["GET"])
def cache_connectivity():
    connectivity_name = request.args.get("connectivity")
    start = request.args.get("start")
    end = request.args.get("end")
    overlap = float(request.args.get("overlap"))
    nperseg = float(request.args.get("nperseg"))
    print(f"{bcolors.DEBUG}start: {start}, end: {end}{bcolors.ENDC}")
    file_name = session["user_data_dir"]
    cal = data_in_db(file_name, request.url, Calculation.query)
    if not cal:
        # error handling
        if start is None:
            start = 0
            # end will be the last time frame
        if end is None:
            end = 1
        if int(math.floor(float(start))) > int(math.floor(float(end))):
            end = str(int(start) + 1)
        manager.get_connectivity_matrices(
            request, connectivity_name, start, end, overlap, nperseg
        )
    return "cached!", 200


@bp.route("/granger", methods=["GET"])
def granger():
    return manager.granger()


@bp.route("/timeSeries", methods=["GET"])
def get_time_series():
    channel_name = request.args.get("elecName")  # electrode (channel) id
    start = float(request.args.get("start"))  # start time of the time frame
    end = float(request.args.get("end"))  # end time of the time frame
    resolution = request.args.get("resolution")  # resolution of the time series
    file_name = session["user_data_dir"]
    url = (
        "http://localhost:5000/timeSeries?elecName="
        + channel_name
        + "&start="
        + str(start)
        + "&end="
        + str(end)
        + "&resolution="
        + str(resolution)
    )
    cal = data_in_db(file_name=file_name, url=url, table=Calculation.query)
    if cal:
        print("Cached")
        return cal.data
    else:
        return manager.get_time_series(
            channel_name=channel_name,
            start=start,
            end=end,
            resolution=resolution,
            url=url,
        )


# get_graph_basic_info
#   Parameters:
#      None
#  Returns:
#     layout,
#     nodes: { id, label, x?, y?,  }
#     edges: { id, from, to, label?, }
@bp.route("/graph", methods=["GET"])
def get_graph_basic_info():
    return manager.get_graph_basic_info()


@bp.route("/logout", methods=["GET"])
def logout():
    if "username" in session:
        print(
            f"{bcolors.GETREQUEST}user logged out: {session['username']}{bcolors.ENDC}"
        )
        session.pop("username", None)
        session.pop("user_root_dir", None)
        session.pop("user_data_dir", None)
        return jsonify({"message": "Logged out successfully!"})
    return jsonify({"message": "No user logged in!"}), 400


def get_brain_image_async(file_name, azimuth=0, elevation=90, distance=360, **kwargs):
    get_brain_image(
        file_name, azimuth=azimuth, elevation=elevation, distance=distance, **kwargs
    )


@bp.route("/brainImage", methods=["GET"])
def brain_image():
    # the fields are azimuth, elevation, and distance
    azi = request.args.get("azimuth")
    ele = request.args.get("elevation")
    dis = request.args.get("distance")
    print(f"{bcolors.DEBUG}azi: {azi}, ele: {ele}, dis: {dis}{bcolors.ENDC}")
    # build file name
    file_name = manager.brain_image(azi=azi, ele=ele, dis=dis)
    return send_file(file_name, mimetype="image/gif")


@bp.route("/brainImageParamsList", methods=["GET"])
def get_image_params():
    return manager.get_image_params()


@bp.route("/connectivityMeasuresList", methods=["GET"])
def connectivity_list():
    return manager.connectivity_list()


###############################################
############### POST REQUESTS #################
###############################################


@bp.route("/register", methods=["POST"])
def register():
    return manager.register(request=request)


@bp.route("/addFile", methods=["POST"])
def add_file():
    return manager.add_file(request=request)


@bp.route("/saveSettings", methods=["POST"])
def save_settings():
    return manager.save_settings(request=request)


@bp.route("/setFile", methods=["POST"])
def set_file():
    return manager.set_file(request=request)


@bp.route("/getGraphVideo", methods=["POST"])
def get_graph_video():
    return manager.get_graph_video(request=request)


@bp.route("/exportData", methods=["POST"])
def export_data():
    print(f"{bcolors.DEBUG}exporting data{bcolors.ENDC}")
    data = request.json
    print(f"{bcolors.DEBUG}data: {data}{bcolors.ENDC}")
    start = data["time"]["start"]
    end = data["time"]["end"]
    resolution = data["time"]["resolution"]
    file_name = data["fileName"]
    connectivity_measure = data["connectivityMeasure"]
    print(
        f"{bcolors.DEBUG}start: {start}, end: {end}, resolution: {resolution} connectivityMeasure: {connectivity_measure}{bcolors.ENDC}"
    )
    return manager.export_data(
        start=start,
        end=end,
        resolution=resolution,
        file_name=file_name,
        connectivity_measure=connectivity_measure,
    )
