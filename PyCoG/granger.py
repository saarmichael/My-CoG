import pandas as pd
import os
from statsmodels.tsa.stattools import grangercausalitytests
import sys
from contextlib import contextmanager


@contextmanager
def suppress_stdout():
    with open(os.devnull, "w") as devnull:
        old_stdout = sys.stdout
        sys.stdout = devnull
        try:
            yield
        finally:
            sys.stdout = old_stdout


def calculate_granger_for_all_pairs(data, maxlag=1):
    df = pd.DataFrame(data)
    num_electrodes = df.shape[1]
    granger_results = {}

    # Loop over all pairs of electrodes
    for i in range(num_electrodes):
        for j in range(num_electrodes):  # avoid duplicate pairs and self-pairs
            # Run the Granger causality test
            # with suppress_stdout():
            gc_res = grangercausalitytests(df[[i, j]], maxlag=maxlag)

            # Store the results with string keys, convert numpy.int32 to int
            granger_results[f"{i},{j}"] = {
                int(lag): test_result[0]["ssr_ftest"][1]
                for lag, test_result in gc_res.items()
            }  # here we store p-values

    print(granger_results)
    return granger_results
