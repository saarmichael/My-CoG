import sqlalchemy as db
  
# Defining the Engine
engine = db.create_engine('sqlite:///CogDb.db', echo=True)
  
# Create the Metadata Object
metadata_obj = db.MetaData()
  
  
# database name
profile = db.Table(
    'users',                                        
    metadata_obj,    
    db.Column('id', db.Integer, primary_key=True),                                  
    db.Column('username', db.String),                    
    db.Column('data_dir', db.JSON),
    db.Column('settings', db.JSON),            
)

calculation = db.Table(
    'calculations',
    metadata_obj,
    db.Column('id', db.Integer, primary_key=True),
    db.Column('File name', db.String),
    db.Column('url', db.String),
    db.Column('data', db.JSON),
    db.Column('Created by', db.String),
)
  
# Create the profile table
metadata_obj.create_all(engine)