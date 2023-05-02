from server_config import Calculation, db

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
    user = {
        "username": username,
        "data_dir": data_dir,
        "settings": settings,
    }
    db.session.add(user)
    db.session.commit()
    return user