import json, base64
from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from app.dependencies import verify_token
from app.schemas.auth import Token, LoginModel
from app.libraries.libauth import Auth

router = APIRouter()
oAuth = Auth()


@router.post("/auth/login", response_model=Token)
async def login(login_model: LoginModel):
    token = await oAuth.authenticate_user(login_model.username, login_model.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"access_token": token, "token_type": "bearer"}


@router.get("/auth/test")
async def test(user = Depends(verify_token)):
    return JSONResponse(json.loads(json.dumps(user.dict(), default=str)))

@router.get("/auth/me")
async def test(user = Depends(verify_token)):        
    user_data = user.dict()    
    if user_data.get("employee_photo"):
        user_data['employee_photo'] =f"data:image/jpg;base64, {user_data['employee_photo'].decode('utf-8')}"
    return user_data
