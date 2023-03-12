import os
import json


def write_dict(dict, file_name):
    cwd = os.getcwd()
    # move back one directory
    os.chdir('..')
    os.chdir('my-cog\src\shared\ecog_data')
    # add the .json extension if it is not there
    if file_name[-5:] != '.json':
        file_name = file_name + '.json'
    # delete the old files if they exist
    if os.path.exists(file_name):
        os.remove(file_name)
    
    with open(file_name, 'w') as f:
        json.dump(dict, f)
    f.close()
    os.chdir(cwd)

def write_np_dict(dict, file_name):
    cwd = os.getcwd()
    # move back one directory
    os.chdir('..')
    os.chdir('my-cog\src\shared\ecog_data')
    # add the .json extension if it is not there
    if file_name[-5:] != '.json':
        file_name = file_name + '.json'
    # delete the old files if they exist
    if os.path.exists(file_name):
        os.remove(file_name)
    #jsonify the numpy arrays and make the keys floats
    json_dict = {}
    for key in dict:
        json_dict[float(key)] = dict[key].tolist()
    with open(file_name, 'w') as f:
        json.dump(json_dict, f)
    f.close()
    os.chdir(cwd)

def write_coherence_matrices(f, coherence_matrices, file_name):
    # write into a json file two fields: f and Cxy. f is number[] and Cxy is number[][][]
    # create a dictionary to hold the data
    data_dict = {
        'f': f.tolist(),
        'Cxy': coherence_matrices.tolist()
    }
    write_dict(data_dict, file_name)



def write_array(data, file_name):
    # create a dictionary to hold the data
    data_dict = {
        'data': data.tolist()
    }
    # save the current working directory
    write_dict(data_dict, file_name)

def write_matrix(data, file_name):
    # create a dictionary to hold the data
    data_dict = {
        'data': data.tolist()
    }
    # save the current working directory
    write_dict(data_dict, file_name)

def write_spectrogram(t, f, Sxx, file_name):
    # create a dictionary to hold the spectrogram data
    spectrogram = {
        't': t.tolist(),
        'f': f.tolist(),
        'Sxx': Sxx.tolist()
    }
    write_dict(spectrogram, file_name)
