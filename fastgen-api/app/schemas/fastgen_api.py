from pydantic import BaseModel
from typing import Optional

class Fastgen_apiModel(BaseModel):          
    name: str 
    path: str