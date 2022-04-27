import json
from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from app.dependencies import verify_token
from app.schemas.auth import Token
from app.libraries.libauth import Auth

router = APIRouter()
oAuth = Auth()


@router.post("/auth/login", response_model=Token)
async def login(username: str = Form(...), password: str = Form(...)):
    token = await oAuth.authenticate_user(username, password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"access_token": token, "token_type": "bearer"}


@router.get("/auth/test")
async def test(user = Depends(verify_token)):
    return JSONResponse(json.loads(json.dumps(user.dict(), default=str)))