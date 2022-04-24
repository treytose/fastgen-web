from pydantic import BaseModel
from fastapi import Query
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):    
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None    

class UserInDB(User):    
    userid: int = Query(None)
    hashed_password: str


class SignupModel(User):
  password: str = Query(None, min_length=8)