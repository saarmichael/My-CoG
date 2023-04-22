import sqlalchemy as db
  
# Defining the Engine
engine = db.create_engine('sqlite:///users.db', echo=True)
  
# Create the Metadata Object
metadata_obj = db.MetaData()
  
  
# database name
profile = db.Table(
    'users',                                        
    metadata_obj,    
    db.Column('id', db.Integer, primary_key=True),                                  
    db.Column('name', db.String),                    
    db.Column('data_dir', db.String),                
)

calculation = db.Table(
    'calculations',
    metadata_obj,
    db.Column('id', db.Integer, primary_key=True),
    db.Column('data_dir', db.String),
    db.Column('coherence_calculation', db.JSON),
)
  
# Create the profile table
metadata_obj.create_all(engine)