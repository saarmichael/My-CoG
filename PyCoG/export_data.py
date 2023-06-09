import numpy as np

from coherence import coherence_time_frame
from scipy.io import savemat


def export_connectivity_to_mat(conn_func, name, data, sfreq, start, end, meta_data):
    f, CM = conn_func(data, sfreq)  # the actual calculation
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
