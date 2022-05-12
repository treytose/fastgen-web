import traceback, base64
from datetime import datetime, timedelta
from ldap3 import Server, Connection, AUTO_BIND_NO_TLS, SUBTREE, ALL_ATTRIBUTES, ALL
from fastapi import HTTPException
from app import db, SECRET_KEY, ALGORITHM, AD_SERVER, AD_DOMAIN, ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas.auth import User, UserInDB, TokenData

from passlib.context import CryptContext
import jwt

class Auth:    
    def __init__(self):
      self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  

    async def generate(self):
        await db.create_schema("user", UserInDB.schema()) 

    async def get_user(self, userid: int):
        user = await db.fetchone("SELECT * FROM user WHERE userid = :userid", {"userid": userid})                
        return UserInDB(**user)

    async def get_safe_user(self, userid: int):
        user = await self.get_user(userid)
        return User(**user.dict())

    async def get_user_by_username(self, username: str):
        user = await db.fetchone("SELECT * FROM user WHERE username = :username", {"username": username})
        if not user:
          return None
        return UserInDB(**user)

    async def create_user(self, user: User):
        userid = await db.insert("user", user.dict())
        return userid

    async def update_user(self, userid: int, user: User):
        error_no = await db.update("user", "userid", userid, user.dict())
        return error_no
    
    ### auth ###
    async def verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    async def get_password_hash(self, password):
        return self.pwd_context.hash(password)    

    async def authenticate_user(self, username: str, password: str):  
        full_username = f"{username}@{AD_DOMAIN}"
        user = await self.get_user_by_username(username)

        try:  
            server = Server(AD_SERVER, get_info=ALL)
            connection = Connection(server, user=full_username, password=password)
            connection.bind()

            search_base = ",".join(f"dc={s}" for s in AD_DOMAIN.split("."))
            connection.search(
                search_base=search_base,
                search_filter=f"(&(objectClass=user)(sAMAccountName={username}))",
                search_scope=SUBTREE,
                attributes=ALL_ATTRIBUTES
            )

            resp = connection.response

            if not resp:
                raise Exception("no response from AD. Invalid credentials")

        except Exception as e:            
            raise HTTPException(status_code=403, detail="Invalid username or password")
                                
        # map AD attributes to user attributes 
        ad_user_map = {
            "mailNickname": "username",                 
            "displayName": "display_name",
            "givenName": "given_name",
            "mail": "email",
            "title": "title",
            "department": "department",
            "telephoneNumber": "phone",
            "company": "company",
            "employeeID": "employee_id",
            "thumbnailPhoto": "employee_photo",
        }
    
        user_details = {}
        for attr, value in resp[0]['attributes'].items():
            if attr in ad_user_map:
                if attr == "thumbnailPhoto" and isinstance(value, bytes):
                    # value = value.decode('ISO-8859-1')
                    value = base64.b64encode(value)

                user_details[ad_user_map[attr]] = value                

        oUser = User(**user_details)
        if user:
            await self.update_user(user.userid, oUser)
        else:
            userid = await self.create_user(oUser)
            user = await self.get_user(userid)

        token = await self.create_user_token(user, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return token

    async def create_user_token(self, user: UserInDB, expires_delta: timedelta = None):
        token = await self.create_access_token(
            { "sub": user.userid }, 
            expires_delta
        )
        return token
    
    async def create_access_token(self, data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    async def get_current_user(self, token: str):   
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])        
        userid = payload.get("sub")

        user = await self.get_safe_user(userid)
        return user

