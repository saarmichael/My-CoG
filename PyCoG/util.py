import glob

def find_file(pattern, path):
    for file in glob.glob(f'{path}/**/{pattern}', recursive=True):
        return file