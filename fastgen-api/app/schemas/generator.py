from pydantic import BaseModel
from typing import Optional

class GeneratorModel(BaseModel):          
    name: str 
    path: str