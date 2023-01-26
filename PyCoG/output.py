import os

def write_array(data, file_name):
    # save the current working directory
    cwd = os.getcwd()
    # move back one directory
    os.chdir('..')
    os.chdir('my-cog\src\ecog_data')
    # delete the old files if they exist
    if os.path.exists(file_name):
        os.remove(file_name)
    # write the first 10000 samples to a json file as an array
    with open(file_name, 'w') as f:
        f.write(str(data.tolist()))
    # close the file
    f.close()
    # move back to the original working directory
    os.chdir(cwd)

def write_matrix(data, file_name):
    # write a matrix to a json file. Each row is a list
    # save the current working directory
    cwd = os.getcwd()
    # move back one directory
    os.chdir('..')
    os.chdir('my-cog\src\ecog_data')
    # delete the old files if they exist
    if os.path.exists(file_name):
        os.remove(file_name)
    # write the first 10000 samples to a json file as an array
    with open(file_name, 'w') as f:
        f.write(str(data.tolist()))
    # close the file
    f.close()
    # move back to the original working directory
    os.chdir(cwd)

