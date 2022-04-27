from fastapi import FastAPI
from . import db

# routers 
from .routers import auth

app = FastAPI()

@app.get("/hello")
async def hello():
    return "Hello World"

# app events #
@app.on_event("startup")
async def startup_event():
    await db.connect()
    await auth.oAuth.generate()

@app.on_event("shutdown")
async def shutdown_event():
    await db.disconnect()

# register routers #
app.include_router(auth.router)
