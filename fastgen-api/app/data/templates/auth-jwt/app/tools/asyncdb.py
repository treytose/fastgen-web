import os
from databases import Database
from rich.console import Console

console = Console()

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
            console.print("[green]database connection OK")

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
                INSERT INTO `{table}` ({",".join(entity.keys())}) 
                VALUES ({",".join([f":{k}" for k in entity.keys()])})
            ''',
            values=entity)
        return insert_id

    async def update(self, table: str, key_column: str, key_value, entity: dict):
        error_no = await self.db.execute(
            query=f'''
                UPDATE `{table}`
                SET {",".join([f'{k}=:{k}' for k in entity.keys()])}
                WHERE {key_column}={key_value}
            ''',
            values=entity
        )
        return error_no

    async def delete(self, table: str, key_column: str, key_value):
        error_no = await self.db.execute(
            query=f'''
                DELETE FROM `{table}`
                WHERE {key_column}=:{key_column}_value
            ''',
            values={f"{key_column}_value": key_value}
        )
        return error_no


    async def create_schema(self, table, schema):
        pk_name = table + "id"

        if pk_name in schema['properties']:
            del schema['properties'][pk_name]

        if self.DB_TYPE == "sqlite":        
            return await self.__generate_sqlite_table__(table, schema)    
        else:
            return await self.__generate_sql_table__(table, schema)

    async def __generate_sql_table__(self, table, schema):        
        pk_name = table + "id"                          

        type_map = {
            'string': 'VARCHAR',
            'boolean': 'BOOLEAN',
            'integer': 'INTEGER',
            'number': 'FLOAT',
            'date-time': 'DATETIME',
            'date': 'DATE'
        }         

        def get_column_def(name, prop):
            _type = None
            if 'format' in prop and prop['format'] in type_map:
                _type = type_map[prop['format']]
            elif prop['type'] in type_map:
                _type = type_map[prop['type']]

            if not _type:
                return

            type_arg = ""
            if _type == 'VARCHAR':
                if prop.get('maxLength'):
                    type_arg = prop['maxLength']
                else:
                    type_arg = 32

            if type_arg:
                type_arg = f"({type_arg})"

            nullable = "NOT NULL" if name in schema.get('required', []) else "NULL"

            default = ""
            if prop.get("default"):
                if prop.get("type") == "string":
                    default = f"DEFAULT '{prop['default']}'"
                else:
                    default = f"DEFAULT {prop['default']}"

            comment = f"COMMENT '{prop['description']}'" if prop.get("description") else ""            
            column_def = f"{name} {_type}{type_arg} {nullable} {default} {comment}"
            return column_def

        def get_constraint(name, prop):            
            try:
                if not prop.get("foreign_key"):
                    return ""

                ftable, fcol = prop["foreign_key"].split(".")                
                on_delete = "ON DELETE CASCADE" if name in schema.get('required', []) else "ON DELETE SET NULL"
                constraint = f'''
                    FOREIGN KEY ({name}) 
                    REFERENCES {ftable}({fcol})
                    {on_delete}
                '''
                return constraint
            except Exception as e:
                print(e)
                console.print(f"[yellow]:warning:  WARNING:[/yellow] failed to generate constraint for '{name}'")
            
        try:
            sql_schema = await self.fetchall(f"DESCRIBE `{table}`")                               
        except Exception as e:
            sql_schema = None

        if sql_schema:  
            table_map = {s[0]: s for s in sql_schema}          
            table_keys = list(table_map.keys())

            in_schema_and_not_table = list(filter(lambda k: k not in table_keys, list(schema['properties'].keys())))
            in_table_and_not_schema = list(filter(lambda k: k not in schema['properties'].keys() and k != pk_name, table_keys))
            
            for column_name in in_schema_and_not_table:
                column_def = get_column_def(column_name, schema['properties'][column_name])                

                alter_table_sql = f'ALTER TABLE `{table}` ADD COLUMN {column_def}'
                await self.db.execute(alter_table_sql)
                console.print(f'MySQL updated: [purple on black]{alter_table_sql}')

            for column_name in in_table_and_not_schema:
                console.print(f"[yellow]:warning:  WARNING:[/yellow] column '{column_name}' in table '{table}' but not in schema '{schema['title']}'")


            sql_schema = await self.fetchall(f"DESCRIBE `{table}`")
            # ensure constraints are added #            
            for name, prop in schema['properties'].items():
                constraint = get_constraint(name, prop)
                if constraint:
                    if not "MUL" in table_map[name]:
                        alter_table_sql = f'ALTER TABLE `{table}` ADD CONSTRAINT {constraint}'
                        await self.db.execute(alter_table_sql)
                        console.print(f'MySQL updated: [purple on black]{alter_table_sql}')

        else:
            # create table #
            columns = []            
            constraints = []
            for name, prop in schema['properties'].items():
                column_def = get_column_def(name, prop)
                constraint = get_constraint(name, prop)
                
                if column_def:
                    columns.append(column_def)

                if constraint:
                    constraints.append(constraint)
                                                                                

            column_str = ",\n                    ".join(columns)
            if len(constraints) > 0:
                column_str += ","
                constraint_str = ",\n                ".join(constraints)
            else:
                constraint_str = ""

            create_table_sql = f'''
                CREATE TABLE IF NOT EXISTS `{table}` (
                    {pk_name} INT PRIMARY KEY AUTO_INCREMENT, 
                    {column_str}
                    {constraint_str}
                )
            '''

            console.print(f'[purple on black]{create_table_sql}')

            await self.db.execute(create_table_sql)        

    async def __generate_sqlite_table__(self, table, schema):
        pk_name = table + "id"

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
                console.print(f"Updating SQLite table [purple on black] ALTER TABLE {table} ADD COLUMN {column_name} {_type}")

            for column_name in in_table_and_not_schema:
                console.print(f"[yellow]:warning: [/yellow] Schema {schema['title']} is missing property: {column_name}")
        else:
            columns = ", ".join([f"{k} {type_map[v['type']]}" for k,v in schema['properties'].items()])
            console.print(f"[purple on black]CREATE TABLE {table} ({pk_name} INT PRIMARY KEY, {columns})")
            await self.db.execute(f"CREATE TABLE {table} ({pk_name} INTEGER PRIMARY KEY AUTOINCREMENT, {columns})")

        

