from fastapi import FastAPI
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

    # generate tables #
    await fastgen_api.oFastgen_api.generate()

@app.on_event("shutdown")
async def shutdown_event():
    await db.disconnect()

# register routers #
app.include_router(fastgen_api.router)


