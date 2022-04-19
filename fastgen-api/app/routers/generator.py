from fastapi import APIRouter
from app.libraries.libgenerator import Generator
from app.schemas.generator import GeneratorModel

router = APIRouter()
oGenerator = Generator()

@router.get("/generator")
async def get_generator_list(limit: int = 100):            
    return await oGenerator.get_generator_list(limit)

@router.get("/generator/generatorid")
async def get_generator(generatorid: int):
    return await oGenerator.get_generator(generatorid)

@router.post("/generator")
async def create_generator(generator: GeneratorModel):
    return await oGenerator.create_generator(generator.dict())

@router.put("/generator/generatorid")
async def update_generator(generatorid: int, generator: GeneratorModel):
    return await oGenerator.update_generator(generatorid, generator.dict())

@router.delete("/generator/generatorid")
async def delete_generator(generatorid: int):
    return await oGenerator.delete_generator(generatorid)