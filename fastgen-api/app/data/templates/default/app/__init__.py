from dotenv import load_dotenv
from app.tools.asyncdb import AsyncDB

# load environment variables from .env 
load_dotenv()

# db init #
db = AsyncDB()