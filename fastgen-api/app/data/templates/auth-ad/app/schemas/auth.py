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
    display_name: Optional[str] = None    
    given_name: Optional[str] = None    
    email: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    employee_id: Optional[int] = None
    employee_photo: Optional[bytes] = None


class UserInDB(User):    
    userid: int = Query(None)
    