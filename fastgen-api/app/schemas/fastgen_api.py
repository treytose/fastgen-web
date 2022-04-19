from pydantic import BaseModel
from fastapi import Query
from typing import Optional

class Fastgen_apiModel(BaseModel):          
    name: str 
    path: str
    pythonVersion: str
    dbType: Optional[str] = Query(None, title="Database Type")
    dbName: str
    dbUser: str
    dbPass: str    