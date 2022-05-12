import os, shutil, subprocess, secrets
from fastapi import HTTPException
from app.dependencies import db
from app.schemas.fastgen_api import Fastgen_apiModel, EntityModel

class Fastgen_api:
    def __init__(self):
        self.BASE_TEMPLATE_PATH = "app/data/templates/"

    async def generate(self):
        await db.create_schema("fastgen_api", Fastgen_apiModel.schema())

    async def get_fastgen_api_schema(self):
        return Fastgen_apiModel.schema()
        
    async def get_fastgen_api_list(self, limit: int = 100):
        fastgen_api = await db.fetchall("SELECT * FROM fastgen_api LIMIT :limit", {"limit": limit})
        return fastgen_api

    async def get_fastgen_api(self, fastgen_apiid: int):
        fastgen_api = await db.fetchone("SELECT * FROM fastgen_api WHERE fastgen_apiid=:fastgen_apiid", {"fastgen_apiid": fastgen_apiid})
        return fastgen_api

    async def create_fastgen_api(self, fastgen_api: Fastgen_apiModel):
        if os.path.exists(os.path.join(fastgen_api.path, fastgen_api.name)):
            raise HTTPException(status_code=500, detail="File already exists")
        
        template_path = os.path.join(self.BASE_TEMPLATE_PATH, fastgen_api.template)
        shutil.copytree(template_path, os.path.join(fastgen_api.path, fastgen_api.name))


        # create the virtual environment and install required packages #
        owd = os.getcwd()
        os.chdir(os.path.join(fastgen_api.path, fastgen_api.name))

        if fastgen_api.pythonVersion == "python3.6":
            subprocess.run("python3.6 -m venv venv", shell=True, check=True)            
        else:
            subprocess.run("python3.9 -m venv venv", shell=True, check=True)

        subprocess.run("venv/bin/pip install --upgrade pip", shell=True, check=True)
        subprocess.run("venv/bin/pip install -r requirements.txt", shell=True, check=True)

        with open(os.path.join(fastgen_api.path, fastgen_api.name, ".env"), "w") as f:
            if fastgen_api.dbType:
                f.write(f'DB_TYPE={fastgen_api.dbType}\n')                

            if fastgen_api.dbHost:
                f.write(f'DB_HOST={fastgen_api.dbHost}\n')       

            if fastgen_api.dbUser:                         
                f.write(f'DB_USER={fastgen_api.dbUser}\n')       

            if fastgen_api.dbName:
                f.write(f'DB_NAME={fastgen_api.dbName}\n') 

            if fastgen_api.dbPass:
                f.write(f'DB_PASS={fastgen_api.dbPass}\n')
                
            if fastgen_api.template in ["auth-jwt", "auth-ad"]:
                f.write(f'SECRET_KEY={secrets.token_urlsafe(32)}')
                f.write('ALGORITHM=HS256\n')
                

        os.chdir(owd)

        fastgen_apiid = await db.insert("fastgen_api", fastgen_api.dict())
        return fastgen_apiid

    async def update_fastgen_api(self, fastgen_apiid: int, fastgen_api: Fastgen_apiModel):
        error_no = await db.update("fastgen_api", "fastgen_apiid", fastgen_apiid, fastgen_api)
        return error_no

    async def delete_fastgen_api(self, fastgen_apiid: int):
        error_no = await db.delete("fastgen_api", "fastgen_apiid", fastgen_apiid)
        return error_no

    async def inject_entity(self, fastgen_apiid: int, entity: EntityModel):
        api: Fastgen_apiModel = await self.get_fastgen_api(fastgen_apiid)
        path = os.path.join(api.path, api.name)

        # create schema #
        with open(os.path.join(path, "app", "schemas", f"{entity.name}.py"), "w") as f:
            f.write(clean_code(entity.schema_code))

        # create router #
        with open(os.path.join(path, "app", "routers", f"{entity.name}.py"), "w") as f:
            f.write(clean_code(entity.router_code))

        # create library #
        with open(os.path.join(path, "app", "libraries", f"lib{entity.name}.py"), "w") as f:
            f.write(clean_code(entity.lib_code))

        # update main.py #
        with open(os.path.join(path, "app", "main.py"), "r") as f:
            main = f.read()

        capName = entity.name[0].upper() + entity.name[1:]

        if not f"await {entity.name}.o{capName}.generate()" in main:
            main = insert_after(main, "await db.connect()", f"await {entity.name}.o{capName}.generate()")

        if not f"from .routers import {entity.name}" in main:
            main = insert_after(main, "# routers", f"from .routers import {entity.name}")

        if not f"app.include_router({entity.name}.router)" in main:
            main = insert_after(main, "# register routers #", f"app.include_router({entity.name}.router)")

        with open(os.path.join(path, "app", "main.py"), "w") as f:
            f.write(main)

        return "OK"


### Helpers ###
def clean_code(code: str):
    return fix_indention(clean_whitespace(code))

def get_leading_whitespace(string):
    print(string)
    leading_ws = ""
    for letter in string:
        if letter == " ":
            leading_ws += " "
        else:
            break
    return leading_ws

def insert_after(file_data, search, line):
    split_data = file_data.split("\n")
    for i, data in enumerate(split_data[:]):
        if search in data:
            split_data.insert(i+1, f"{get_leading_whitespace(data)}{line}")
    return "\n".join(split_data)

def clean_whitespace(code):    
    start_row_count = 0
    split_code = code.split("\n")
    for row in split_code:
        if row.strip() != "":
            break        
        start_row_count += 1
        
    code_reverse = split_code[:]
    code_reverse.reverse()
    
    end_row_count = 0
    for row in code_reverse:
        if row.strip() != "":
            break
        end_row_count += 1
        
    if start_row_count > 0 and end_row_count > 0:        
        return "\n".join(split_code[start_row_count: -end_row_count])
    
    if start_row_count > 0:
        return "\n".join(split_code[start_row_count:])
    
    if end_row_count > 0:
        return "\n".join(split_code[:-end_row_count])
        
def fix_indention(code):
    leading_whitespace = 0
    split_code = code.split("\n")
    
    for c in split_code[0]:          
        if c != " ":
            break            
        leading_whitespace += 1
            
            
    for i in range(len(split_code)):
        split_code[i] = split_code[i][leading_whitespace:]
            
    return "\n".join(split_code)