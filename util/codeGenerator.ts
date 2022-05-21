import { EColumn } from "../components/entity/EntityColumn";
import { toTitle } from ".";

// helper function
function indent_and_join(list: string[], spaces = 4) {
  let s = "";
  list.forEach((item) => {
    let line = "";
    for (var i = 0; i < spaces; i++) {
      line += " ";
    }
    line += item.trim();
    line += "\n";
    s += line;
  });

  return s;
}

export default function generateCode(entity: string, columns: EColumn[]) {
  const pkName = `${entity}id`;
  const libName = `o${toTitle(entity)}`;
  const modelName = `${toTitle(entity)}Model`;
  const joinedModelName = `${toTitle(entity)}JoinModel`;
  const className = toTitle(entity);

  function generate_fk_routes() {
    let routes = "";
    columns.forEach((ecolumn) => {
      if (!ecolumn.fk || !ecolumn.fk.includes(".")) {
        return;
      }

      let [name, col] = ecolumn.fk.split(".");

      if (ecolumn.fkType === "many2many" || ecolumn.fkType === "one2many") {
        routes += `
      @router.get("/${entity}/{${pkName}}/${name}")
      async def get_${entity}_${name}s(${pkName}: int):
          return await ${libName}.get_${entity}_${name}s(${pkName})
        `;
      } else if (ecolumn.fkType === "one2one") {
        routes += `
      @router.get("/${entity}/{${pkName}}/${name}")
      async def get_${entity}_${name}(${pkName}: int):
          return await ${libName}.get_${entity}_${name}(${pkName})
        `;
      }
    });

    return routes;
  }

  function generate_fk_lib() {
    let methods = "";
    columns.forEach((ecolumn) => {
      if (!ecolumn.fk || !ecolumn.fk.includes(".")) {
        return;
      }

      let [name, col] = ecolumn.fk.split(".");

      if (ecolumn.fkType === "many2many" || ecolumn.fkType === "one2many") {
        methods += `          
        async def get_${entity}_${name}s(self, ${pkName}: int):
            return await db.fetchall('''
              SELECT b.* FROM ${entity} a
                INNER JOIN ${name} b ON b.${col} = a.${ecolumn.name}
              WHERE a.${pkName} = :${pkName}
            ''', {"${pkName}": ${pkName}})
        `;
      } else if (ecolumn.fkType === "one2one") {
        methods += `
        async def get_${entity}_${name}(self, ${pkName}: int):
            return await db.fetchone('''
              SELECT b.* FROM ${entity} a
                INNER JOIN ${name} b ON b.${col} = a.${ecolumn.name}
              WHERE a.${pkName} = :${pkName}
            ''', {"${pkName}": ${pkName}})
        `;
      }
    });

    return methods;
  }

  function generate_join_statements() {
    let joins: string[] = [];
    let vars: string[] = [];

    columns.forEach((ecolumn) => {
      if (!ecolumn.fk || !ecolumn.fk.includes(".")) {
        return;
      }

      let [name, col] = ecolumn.fk.split(".");

      if (ecolumn.fkType === "many2many" || ecolumn.fkType === "one2many") {
        joins.push(
          `${name} = await self.get_${entity}_${name}s(${entity}.${ecolumn.name})`
        );
        vars.push(name);
      } else if (ecolumn.fkType === "one2one") {
        joins.push(
          `${name} = await self.get_${entity}_${name}(${entity}.${ecolumn.name})`
        );
        vars.push(name);
      }
    });

    return `${indent_and_join(joins, 12)}
            return ${joinedModelName} (${
      vars.length > 0 ? vars.map((v) => `${v}=${v}`).join(",") + "," : ""
    } **${entity})
    `;
  }

  const mainCode = `
      from .routers import ${entity}

      app.include_router(${entity}.router)
    `;

  const routerCode = `
      from fastapi import APIRouter
      from app.libraries.lib${entity} import ${className}
      from app.schemas.${entity} import ${modelName}

      router = APIRouter(tags=["${entity}"])
      ${libName} = ${className}()

      @router.get("/${entity}/schema")
      async def get_${entity}_schema(joined: bool = False):              
        return await ${libName}.get_${entity}_schema(joined=joined)        

      @router.get("/${entity}")
      async def get_${entity}_list(joined: bool = False, limit: int = 100, offset: int = 0, sortField: str = None, sortOrder: str = "asc", search: str = ""):
          return await ${libName}.get_${entity}_list(joined=joined, limit=limit, offset=offset, sortField=sortField, sortOrder=sortOrder, search=search)

      @router.get("/${entity}/{${pkName}}")
      async def get_${entity}(${pkName}: int, joined: bool = False):
          return await ${libName}.get_${entity}(${pkName}, joined=joined)

      @router.post("/${entity}")
      async def create_${entity}(${entity}: ${modelName}):
          return await ${libName}.create_${entity}(${entity}.dict())

      @router.put("/${entity}/{${pkName}}")
      async def update_${entity}(${pkName}: int, ${entity}: ${modelName}):
          return await ${libName}.update_${entity}(${pkName}, ${entity}.dict())

      @router.delete("/${entity}/{${pkName}}")
      async def delete_${entity}(${pkName}: int):
          return await ${libName}.delete_${entity}(${pkName})
      ${generate_fk_routes()}

    `;

  const libCode = `
    from http.client import HTTPException
    from app import db
    from app.schemas.${entity} import ${modelName}, ${joinedModelName}

    class ${className}:
        async def __join_${entity}__(self, ${entity}):
${generate_join_statements()}

        async def generate(self):
            await db.create_schema("${entity}", ${modelName}.schema())

        async def get_${entity}_schema(self, joined: bool = False):
            schema = ${joinedModelName}.schema() if joined else ${modelName}.schema()
            for v in schema['properties'].values():
                allowed_values = v.get("form_options", {}).get("allowed_values")
                if allowed_values and isinstance(allowed_values, str) and str.startswith(allowed_values.upper(), "SELECT"):                                
                    v["form_options"]["allowed_values"] = await db.fetchall(allowed_values)                            
            return schema

        async def get_${entity}_list(self, joined: bool = False, limit: int = 100, offset: int = 0, sortField: str = None, sortOrder: str = 'asc', search: str = ''): 
            sortSql = ""
            searchSql = ""
            injectObject = {}
    
            schema = await self.get_${entity}_schema()
    
            if sortField:                        
                sortOrder = 'desc' if sortOrder.lower() == 'asc' else 'asc'
                if not sortField in schema['properties'].keys():
                    raise HTTPException(status_code=400, detail='Invalid sortField')                
                sortSql = f"ORDER BY {sortField} {sortOrder}"
    
            if search:
                searchSql = 'WHERE '
                searchItems = []
                for name in schema['properties'].keys():
                    searchItems.append(f'{name} LIKE :search_{name}')
                    injectObject[f"search_{name}"] = f'%{search}%'
    
                searchSql += " OR ".join(searchItems)                                
                        
            ${entity}_list = await db.fetchall(f"SELECT * FROM ${entity} {searchSql} {sortSql} LIMIT {offset}, {limit}", injectObject)
    
            total_count = await db.fetchone("SELECT count(*) as count FROM ${entity}")
            meta = {
                "total_count": total_count["count"]
            }
    
            if not joined:
                return {"meta": meta, "data": ${entity}_list}
    
            ${entity}_list = [await self.__join_${entity}__(item) for item in ${entity}_list]
            return {"meta": meta, "data": ${entity}_list}

        async def get_${entity}(self, ${pkName}: int, joined: bool = False):
            ${entity} = await db.fetchone("SELECT * FROM ${entity} WHERE ${pkName}=:${pkName}", {"${pkName}": ${pkName}})
            if joined:
                ${entity} = self.__join_${entity}__(${entity})
            return ${entity}

        async def create_${entity}(self, ${entity}: ${modelName}):
            ${pkName} = await db.insert("${entity}", ${entity})
            return ${pkName}

        async def update_${entity}(self, ${pkName}: int, ${entity}: ${modelName}):
            error_no = await db.update("${entity}", "${pkName}", ${pkName}, ${entity})
            return error_no

        async def delete_${entity}(self, ${pkName}: int):
            error_no = await db.delete("${entity}", "${pkName}", ${pkName})
            return error_no
        ${generate_fk_lib()}

    `;

  const typeMap = {
    INT: "int",
    FLOAT: "float",
    VARCHAR: "str",
    DATETIME: "datetime.datetime",
    BOOLEAN: "bool",
  };

  const needsDatetimeImport = columns.map((c) => c.type).includes("DATETIME");
  const formatDefault = (c: EColumn, isSql = false) => {
    if (!c.defaultValue) {
      return "None";
    }

    if (c.type === "VARCHAR") {
      return `'${c.defaultValue}'`;
    }

    if (c.type === "BOOLEAN" && !isSql) {
      return c.defaultValue === "false" ? "False" : "True";
    }
    return c.defaultValue;
  };

  function generate_joined_schema() {
    const joins: string[] = [];

    columns.forEach((ecolumn) => {
      if (!ecolumn.fk || !ecolumn.fk.includes(".")) {
        return;
      }

      let [name, col] = ecolumn.fk.split(".");

      joins.push(`${name}: ${toTitle(name)}JoinModel = None`);
    });

    return indent_and_join(joins, 12) || "            pass";
  }

  function generate_schema_imports() {
    let imports: string[] = [];
    columns.forEach((ecolumn) => {
      if (!ecolumn.fk || !ecolumn.fk.includes(".")) {
        return;
      }

      let [name, col] = ecolumn.fk.split(".");

      imports.push(`from .${name} import ${toTitle(name)}JoinModel`);
    });
    return indent_and_join(imports, 6);
  }

  function format_schema_column(c: EColumn) {
    let columnString = `${c.name}: `;
    let queryArgs = [];
    let formOptions: {
      optional?: number;
      display?: number;
      allowed_values?: string | string[];
    } = {};

    if (c.optional) {
      columnString += `Optional[${typeMap[c.type]}] `;
    } else {
      columnString += `${typeMap[c.type]} `;
    }

    queryArgs.push(formatDefault(c));

    if (c.title || c.name) {
      queryArgs.push(`title="${c.title || c.name}"`);
    }

    if (c.description) {
      queryArgs.push(`description="${c.description}"`);
    }

    if (c.type == "VARCHAR" && c.typeArg) {
      queryArgs.push(`max_length=${c.typeArg}`);
    }

    if (c.fk) {
      queryArgs.push(`foreign_key="${c.fk}"`);
    }

    if (c.optional) {
      formOptions.optional = 1;
    }

    if (c.hideOnForm) {
      formOptions.display = 0;
    }

    if (c.allowedValues) {
      if (c.allowedValues?.toUpperCase().startsWith("SELECT")) {
        formOptions.allowed_values = c.allowedValues;
      } else {
        const allowed_values = c.allowedValues.split(",");
        formOptions.allowed_values = allowed_values;
      }
    }

    // Parse Form Options
    if (formOptions) {
      queryArgs.push(`form_options=${JSON.stringify(formOptions)}`);
    }

    columnString += ` = Query(${queryArgs.join(", ")})`;

    return columnString;
  }

  const types = columns
    .filter((c) => !c.pk)
    .map(format_schema_column)
    .join(" \n          ");

  const schemaCode = `
      from pydantic import BaseModel
      from fastapi import Query
      from typing import Optional    
${generate_schema_imports()}  
      ${needsDatetimeImport ? "import datetime\n" : ""}
      class ${modelName}(BaseModel):          
          ${types}

      class ${joinedModelName}(${modelName}):
${generate_joined_schema()}
          
    `;

  const sqlCode = `
      CREATE TABLE IF NOT EXISTS ${entity} (
        ${columns
          .map((c) =>
            c.pk
              ? `${c.name} INT PRIMARY KEY AUTO_INCREMENT`
              : `        ${c.name} ${c.type}${
                  c.typeArg ? "(" + c.typeArg + ")" : ""
                }${c.optional ? "" : " NOT NULL"}${
                  c.defaultValue ? " DEFAULT " + formatDefault(c, true) : ""
                }`
          )
          .join(",\n")}
      );
    `;

  return { mainCode, routerCode, libCode, schemaCode, sqlCode };
}
