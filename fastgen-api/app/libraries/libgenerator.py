from app.dependencies import db
from app.schemas.generator import GeneratorModel

class Generator:
    async def get_generator_list(self, limit: int = 100):
        generator = await db.fetchall("SELECT * FROM generator LIMIT :limit", {"limit": limit})
        return generator

    async def get_generator(self, generatorid: int):
        generator = await db.fetchone("SELECT * FROM generator WHERE generatorid=:generatorid", {"generatorid": generatorid})
        return generator

    async def create_generator(self, generator: GeneratorModel):
        generatorid = await db.insert("generator", generator)
        return generatorid

    async def update_generator(self, generatorid: int, generator: GeneratorModel):
        error_no = await db.update("generator", "generatorid", generatorid, generator)
        return error_no

    async def delete_generator(self, generatorid: int):
        error_no = await db.delete("generator", "generatorid", generatorid)
        return error_no