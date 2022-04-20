from pydantic import BaseModel
from fastapi import Query
from typing import Optional

class Fastgen_apiModel(BaseModel):          
    name: str = Query(None, title="Name", description="API Name") 
    path: str = Query(None, title="Path", description="Absolute path to API") 
    pythonVersion: Optional[str] = Query('python3.9', title="Python Version", description="The version of Python to create the API with") 
    dbType: Optional[str] = Query('sqlite', title="Database Type", description="The database type to use") 
    dbName: Optional[str] = Query('fast.db', title="Database Name", description="The name of the database or file") 
    dbUser: Optional[str] = Query(None, title="Database User", description="The database user") 
    dbPass: Optional[str] = Query(None, title="Database Password", description="The database password")