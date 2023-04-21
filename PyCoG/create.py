import sqlalchemy as db
  
# Defining the Engine
engine = db.create_engine('sqlite:///users.db', echo=True)
  
# Create the Metadata Object
metadata_obj = db.MetaData()
  
  
# database name
profile = db.Table(
    'user',                                        
    metadata_obj,    
    db.Column('id', db.Integer, primary_key=True),                                  
    db.Column('name', db.String),                    
    db.Column('data_dir', db.String),                
)
  
# Create the profile table
metadata_obj.create_all(engine)