from flask import session
import numpy as np
from db_write import write_calculation
from server_config import Calculation
from cache_check import data_in_db

from coherence import coherence_time_frame
from scipy.io import savemat


def export_connectivity_to_mat(conn_func, name, data, sfreq, start, end, meta_data):
    file_name = session["user_data_dir"]
    url = "http://localhost:5000/connectivity?connectivity=" + meta_data["connectivity_measure"] + "&start=" + str(start) + "&end=" + str(end)
    cal = data_in_db(file_name=file_name, url=url, table=Calculation.query)
    if cal:
        print("Cached")
        data = cal.data
        f = data["f"]
        CM = data["CM"]
    else:
        f, CM = conn_func(data, sfreq)  # the actual calculation
        cal = Calculation(
            file_name=file_name,
            url=url,
            data={"f": f, "CM": CM},
        )
        write_calculation(file_name=file_name, url=url, data={"f": f, "CM": CM}, created_by=session["username"])
    
    # write results to mat file
    full_name = name + ".mat"
    vars_dict = {
        "frequencies": f,
        "connectivity_matrices": CM,
        "start": start,
        "end": end,
    }
    # add the meta data to the dictionary
    vars_dict.update(meta_data)
    savemat(
        full_name,
        vars_dict,
    )
    return
