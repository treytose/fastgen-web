import os, shutil
from fastapi import HTTPException
from app.dependencies import db
from app.schemas.fastgen_api import Fastgen_apiModel

class Fastgen_api:
    def __init__(self):
        self.BASE_TEMPLATE_PATH = "app/data/fastapi-base"

    async def get_fastgen_api_list(self, limit: int = 100):
        fastgen_api = await db.fetchall("SELECT * FROM fastgen_api LIMIT :limit", {"limit": limit})
        return fastgen_api

    async def get_fastgen_api(self, fastgen_apiid: int):
        fastgen_api = await db.fetchone("SELECT * FROM fastgen_api WHERE fastgen_apiid=:fastgen_apiid", {"fastgen_apiid": fastgen_apiid})
        return fastgen_api

    async def create_fastgen_api(self, fastgen_api: Fastgen_apiModel):
        if os.path.exists(os.path.join(fastgen_api.path, fastgen_api.name)):
            raise HTTPException(status_code=500, detail="File already exists")
        shutil.copytree(self.BASE_TEMPLATE_PATH, os.path.join(fastgen_api.path, fastgen_api.name))
        fastgen_apiid = await db.insert("fastgen_api", fastgen_api.dict())
        return fastgen_apiid

    async def update_fastgen_api(self, fastgen_apiid: int, fastgen_api: Fastgen_apiModel):
        error_no = await db.update("fastgen_api", "fastgen_apiid", fastgen_apiid, fastgen_api)
        return error_no

    async def delete_fastgen_api(self, fastgen_apiid: int):
        error_no = await db.delete("fastgen_api", "fastgen_apiid", fastgen_apiid)
        return error_no