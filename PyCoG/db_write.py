import ast
from cache_check import user_in_db
from server_config import User, Calculation, db

def write_calculation(file_name, url, data, created_by):
    calculation = {
        "file_name": file_name,
        "url": url,
        "data": data,
        "created_by": created_by,
    }
    cal = Calculation(
        file_name=file_name, url=url, data=data, created_by=created_by
    )
    db.session.add(cal)
    db.session.commit()
    return calculation


def write_user(username, data_dir, settings):
    user = User(username=username, data_dir='[]', settings=settings)
    db.session.add(user)
    db.session.commit()
    update_data_dir(username, data_dir)
    return user


def update_data_dir(username, new_data_dir):
    user = user_in_db(username, User.query)
    data_dirs = ast.literal_eval(user.data_dir)
    data_dirs.append(new_data_dir)
    user.data_dir = str(data_dirs)
    db.session.commit()
    return user