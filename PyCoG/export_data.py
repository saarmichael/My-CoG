import numpy as np

from coherence import coherence_time_frame
from scipy.io import savemat


def export_coherence_to_mat(name, data, sfreq, start, end):
    f, CM = coherence_time_frame(data, sfreq, start, end)
    # write results to mat file
    full_name = name + ".mat"
    savemat(
        full_name,
        {
            "frequencies": f,
            "coherence": CM,
            "start": start,
            "end": end,
        },
    )
    return
