import os
from databases import Database

class AsyncDB:
    def __init__(self):
        self.DB_TYPE = os.getenv("DB_TYPE") or "mysql"
        self.DB_USER = os.getenv("DB_USER")
        self.DB_PASS = os.getenv("DB_PASS")
        self.DB_HOST = os.getenv("DB_HOST")
        self.DB_NAME = os.getenv("DB_NAME")

        if self.DB_TYPE == "mysql":
            if not self.DB_USER:
                raise Exception("Missing required environment variable: DB_USER")
            if not self.DB_PASS:
                raise Exception("Missing required environment variable: DB_PASS")
            if not self.DB_HOST:
                raise Exception("Missing required environment variable: DB_HOST")
            if not self.DB_NAME:
                raise Exception("Missing required environment variable: DB_NAME")

            connection_string = 'mysql://%s:%s@%s/%s?charset=utf8' % (                
                self.DB_USER,
                self.DB_PASS,
               self.DB_HOST,
                self.DB_NAME
            )        

            self.db = Database(connection_string)
        else:
            if not self.DB_NAME:
                raise Exception("Missing required environment variable: DB_NAME")
                
            self.db = Database("sqlite:///app/data/%s" % (
                self.DB_NAME
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
                WHERE {key_column}=:{key_column}_value
            ''',
            values={f"{key_column}_value": key_value}
        )
        return error_no


    async def create_schema(self, table, schema):
        pk_name = table + "id"

        if self.DB_TYPE == "sqlite":            
            type_map = {
                'string': 'TEXT',
                'integer': 'INTEGER',
                'float': 'FLOAT',
                'number': 'FLOAT'
            }
            sqlite_schema_string = await self.fetchone(f"SELECT sql FROM sqlite_master WHERE name = '{table}'")

            if sqlite_schema_string:
                sqlite_schema_string = sqlite_schema_string[0]
                sqlite_schema = {k:{"type": v, "args": [*args]} for k,v,*args in [row.strip().split(' ') for row in sqlite_schema_string.split("(")[1].rstrip(');').split(',')]}
                if pk_name in sqlite_schema:
                    del sqlite_schema[pk_name]

                in_schema_and_not_table = list(filter(lambda k: k not in sqlite_schema.keys(), list(schema['properties'].keys())))
                in_table_and_not_schema = list(filter(lambda k: k not in schema['properties'].keys(), list(sqlite_schema.keys())))

                for column_name in in_schema_and_not_table:
                    column = schema['properties'][column_name]
                    _type = type_map[column['type']]
                    await self.db.execute(f"ALTER TABLE {table} ADD COLUMN {column_name} {_type}")
                    print("Adding Column: ", column_name, _type)

                for column_name in in_table_and_not_schema:
                    print(f"WARNING: Schema {schema['title']} is missing property: {column_name}")
            else:
                columns = ", ".join([f"{k} {type_map[v['type']]}" for k,v in schema['properties'].items()])
                print(f"CREATE TABLE {table} ({pk_name} INT PRIMARY KEY, {columns})")
                await self.db.execute(f"CREATE TABLE {table} ({pk_name} INTEGER PRIMARY KEY AUTOINCREMENT, {columns})")
        else:
            # TODO: Create table generation for MySQL/MariaDB
            pass
        

