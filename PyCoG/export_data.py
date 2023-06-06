import numpy as np

from coherence import coherence_time_frame
from scipy.io import savemat


def export_coherence_to_mat(name, data, sfreq, start, end, meta_data):
    f, CM = coherence_time_frame(data, sfreq, start, end)
    # write results to mat file
    full_name = name + ".mat"
    vars_dict = {
        "frequencies": f,
        "coherence": CM,
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
