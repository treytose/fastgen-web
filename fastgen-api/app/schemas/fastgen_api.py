from pydantic import BaseModel
from fastapi import Query
from typing import Optional

class Fastgen_apiModel(BaseModel):          
    name: str = Query(None, title="Name", description="API Name") 
    path: str = Query(None, title="Path", description="Absolute path to API") 
    pythonVersion: Optional[str] = Query('python3.9', title="Python Version", description="The version of Python to create the API with", optional=True, allowed_values=["python3.6", "python3.9"]) 
    dbType: Optional[str] = Query('sqlite', title="Database Type", description="The database type to use", optional=True, allowed_values=["sqlite", "mysql"]) 
    dbHost: Optional[str] = Query("localhost", title="Database Hostname", description="The database hostname", optional=True)
    dbName: Optional[str] = Query('fast.db', title="Database Name", description="The name of the database or file", optional=True) 
    dbUser: Optional[str] = Query(None, title="Database User", description="The database user", optional=True) 
    dbPass: Optional[str] = Query(None, title="Database Password", description="The database password", optional=True)


class EntityModel(BaseModel):
    name: str
    router_code: str
    main_code: str
    lib_code: str
    schema_code: str