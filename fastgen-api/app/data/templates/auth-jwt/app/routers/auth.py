from datetime import timedelta
from fastapi import APIRouter, Depends, Form, HTTPException
from pydantic import ValidationError
from app import ACCESS_TOKEN_EXPIRE_MINUTES
from app.dependencies import verify_token
from app.schemas.auth import Token, SignupModel
from app.libraries.libauth import Auth

router = APIRouter()
oAuth = Auth()


@router.post("/auth/signup", response_model=Token)
async def signup(username: str = Form(...), password: str = Form(...)):
    try:
        signup_model = SignupModel(username=username, password=password)
    except ValidationError as ve:        
        raise HTTPException(status_code=400, detail=str(ve))  

    userid = await oAuth.create_user(signup_model)
    user = await oAuth.get_user(userid)
    token = await oAuth.create_user_token(user, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}


@router.post("/auth/login", response_model=Token)
async def login(username: str = Form(...), password: str = Form(...)):
    token = await oAuth.authenticate_user(username, password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"access_token": token, "token_type": "bearer"}


@router.get("/auth/test")
async def test(user = Depends(verify_token)):
    return user