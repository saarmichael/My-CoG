# if in db return the row
def data_in_db(file_name, url, table):
    return table.filter_by(file_name=file_name, url=url).first()

def user_in_db(username, table):
    return table.filter_by(username=username).first()