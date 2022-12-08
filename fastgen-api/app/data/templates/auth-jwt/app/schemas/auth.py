from pydantic import BaseModel
from fastapi import Query
from typing import Optional
from datetime import datetime

class User(BaseModel):    
    username: str = Query(..., max_length=64)
    signup_date: Optional[datetime] = Query(None, description='Date and time the user signed up')

class UserInDB(User):    
    userid: int = Query(None)
    hashed_password: str = Query(..., max_length=128)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class SignupModel(User):
    password: str = Query(None, min_length=8)