import os
from dotenv import load_dotenv
from app.tools.asyncdb import AsyncDB

# load environment variables from .env 
load_dotenv()

# db init #
db = AsyncDB()

# auth settings #
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM") or "HS256"
AD_SERVER = os.getenv("AD_SERVER")
AD_DOMAIN = os.getenv("AD_DOMAIN")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

if not SECRET_KEY:
    raise Exception("Missing required environment variable SECRET_KEY. Suggested: use 'openssl rand -hex 32' to create one and add it to the .env file.")

if not AD_SERVER:
    raise Exception("Missing required environment variable AD_SERVER")

if not AD_DOMAIN:
    raise Exception("Missing required environment variable AD_DOMAIN")