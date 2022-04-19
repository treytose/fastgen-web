from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel

from .dependencies import db
# routers 
from .routers import fastgen_api

app = FastAPI()


@app.get("/hello")
def hello():
    return "Hello World"

# app events #
@app.on_event("startup")
async def startup_event():
    await db.connect()

@app.on_event("shutdown")
async def shutdown_event():
    await db.disconnect()

# register routers #
app.include_router(fastgen_api.router)


