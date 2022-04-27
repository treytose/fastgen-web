from fastapi import APIRouter
from app.libraries.libfastgen_api import Fastgen_api
from app.schemas.fastgen_api import Fastgen_apiModel, EntityModel

router = APIRouter(tags=["Fastgen API"])
oFastgen_api = Fastgen_api()

@router.get("/fastgen_api/schema")
async def get_fastgen_schema():
    return await oFastgen_api.get_fastgen_api_schema()

@router.get("/fastgen_api")
async def get_fastgen_api_list(limit: int = 100):            
    return await oFastgen_api.get_fastgen_api_list(limit)

@router.get("/fastgen_api/{fastgen_apiid}")
async def get_fastgen_api(fastgen_apiid: int):
    return await oFastgen_api.get_fastgen_api(fastgen_apiid)

@router.post("/fastgen_api")
async def create_fastgen_api(fastgen_api: Fastgen_apiModel):
    return await oFastgen_api.create_fastgen_api(fastgen_api)

@router.put("/fastgen_api/{fastgen_apiid}")
async def update_fastgen_api(fastgen_apiid: int, fastgen_api: Fastgen_apiModel):
    return await oFastgen_api.update_fastgen_api(fastgen_apiid, fastgen_api.dict())

@router.delete("/fastgen_api/{fastgen_apiid}")
async def delete_fastgen_api(fastgen_apiid: int):
    return await oFastgen_api.delete_fastgen_api(fastgen_apiid)


#### Other ####
@router.post("/fastgen_api/{fastgen_apiid}/inject")
async def inject_entity(fastgen_apiid: int, entity: EntityModel):
    return await oFastgen_api.inject_entity(fastgen_apiid, entity)    