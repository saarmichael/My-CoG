import ast
from datetime import datetime
from src.main.tools.cache_check import user_in_db
from src.models.user import User
from src.models.calculation import Calculation
from src.extensions import db
from datetime import datetime, timedelta

def delete_old_calculations():
    one_month_ago = datetime.now() - timedelta(weeks=4)
    old_calculations = Calculation.query.filter(Calculation.time < one_month_ago).all()

    for calculation in old_calculations:
        db.session.delete(calculation)

    db.session.commit()

def write_calculation(file_name, url, data, created_by):
    delete_old_calculations()
    calculation = {
        "file_name": file_name,
        "url": url,
        "data": data,
        "created_by": created_by,
    }
    # get the time
    date_time = datetime.now()
    cal = Calculation(
        time=date_time ,file_name=file_name, url=url, data=data, created_by=created_by
    )
    db.session.add(cal)
    db.session.commit()
    return calculation


def write_user(username, data_dir, settings):
    user = User(username=username, user_root_dir='[]', settings=settings)
    db.session.add(user)
    db.session.commit()
    update_data_dir(username, data_dir)
    return user


def update_data_dir(username, new_data_dir):
    user = user_in_db(username, User.query)
    data_dirs = ast.literal_eval(user.user_root_dir)
    data_dirs.append(new_data_dir)
    user.user_root_dir = str(data_dirs)
    db.session.commit()
    return user

def write_settings(username, data):
    user = user_in_db(username, User.query)
    user.settings = data
    db.session.commit()