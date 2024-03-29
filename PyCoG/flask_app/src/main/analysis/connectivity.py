from src.main.analysis.coherence import get_coherence_matrices, get_coherence_squared_matrices


class Connectivity:
    CONNECTIVITY_MAP = {
        "coherence": get_coherence_matrices,
        "coherence squared": get_coherence_squared_matrices,
    }

    def get_connectivity_list():
        return list(Connectivity.CONNECTIVITY_MAP.keys())

    def get_connectivity_function(name):
        if name not in Connectivity.CONNECTIVITY_MAP:
            raise ValueError("Connectivity function not found")
        return Connectivity.CONNECTIVITY_MAP[name]
