import os
from databases import Database

class AsyncDB:
    def __init__(self):
        DB_TYPE = os.getenv("DB_TYPE") or "mysql"
        DB_USER = os.getenv("DB_USER")
        DB_PASS = os.getenv("DB_PASS")
        DB_HOST = os.getenv("DB_HOST")
        DB_NAME = os.getenv("DB_NAME")


        if DB_TYPE == "mysql":
            if not DB_USER:
                raise Exception("Missing required environment variable: DB_USER")
            if not DB_PASS:
                raise Exception("Missing required environment variable: DB_PASS")
            if not DB_HOST:
                raise Exception("Missing required environment variable: DB_HOST")
            if not DB_NAME:
                raise Exception("Missing required environment variable: DB_NAME")

            connection_string = 'mysql://%s:%s@%s/%s?charset=utf8' % (                
                DB_USER,
                DB_PASS,
                DB_HOST,
                DB_NAME
            )        

            self.db = Database(connection_string)
        else:
            if not DB_NAME:
                raise Exception("Missing required environment variable: DB_NAME")
                
            self.db = Database("sqlite:////app/data/%s" % (
                DB_NAME
            ))

    async def connect(self):
        await self.db.connect()
        if self.db.is_connected:
            print("database connection OK")

    async def disconnect(self):
        await self.db.disconnect()
        print("database connection closed")

    async def fetchone(self, *args, **kwargs):        
        result = await self.db.fetch_one(*args, **kwargs)
        return result

    async def fetchall(self, *args, **kwargs):
        results = await self.db.fetch_all(*args, **kwargs)
        return results
    
    async def insert(self, table: str, entity: dict):
        insert_id = await self.db.execute(
            query=f'''
                INSERT INTO {table} ({",".join(entity.keys())}) 
                VALUES ({",".join([f":{k}" for k in entity.keys()])})
            ''',
            values=entity)
        return insert_id

    async def update(self, table: str, key_column: str, key_value, entity: dict):
        error_no = await self.db.execute(
            query=f'''
                UPDATE {table}
                SET {",".join([f'{k}=:{k}' for k in entity.keys()])}
                WHERE {key_column}={key_value}
            ''',
            values=entity
        )
        return error_no

    async def delete(self, table: str, key_column: str, key_value):
        error_no = await self.db.execute(
            query=f'''
                DELETE FROM {table}
                WHERE :{key_column}=:{key_column}_value
            ''',
            values={key_column: key_column, f"{key_column}_value": key_value}
        )
        return error_no

