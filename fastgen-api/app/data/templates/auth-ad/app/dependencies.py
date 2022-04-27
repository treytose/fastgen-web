from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.libraries.libauth import Auth
from jwt.exceptions import ExpiredSignatureError, InvalidSignatureError

oAuth = Auth()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def verify_token(token: str = Depends(oauth2_scheme)):
    if not token or token == "null":
        raise HTTPException(status_code=401, detail="Not authenticated")          

    try:
        user = await oAuth.get_current_user(token)
    except ExpiredSignatureError as e:
        raise HTTPException(status_code=401, detail="Token expired")    
    except InvalidSignatureError as ie:
        raise HTTPException(status_code=401, detail="Bad token")    
        
    if not user:
        raise HTTPException(status_code=401, detail="Bad token")

    return user