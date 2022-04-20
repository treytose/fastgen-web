import { EColumn } from "../components/entity/EntityColumn";
import { toTitle } from ".";

export default function generateCode(entity: string, columns: EColumn[]) {
    const pkName = `${entity}id`;
    const libName = `o${toTitle(entity)}`;
    const modelName = `${toTitle(entity)}Model`;
    const className = toTitle(entity);

    const mainCode = `
      from .routers import ${entity}

      app.include_router(${entity}.router)
    `;

    const routerCode = `
      from fastapi import APIRouter
      from app.libraries.lib${entity} import ${className}
      from app.schemas.${entity} import ${modelName}

      router = APIRouter()
      ${libName} = ${className}()

      @router.get("/${entity}/schema")
      async def get_${entity}_schema():
        return await ${libName}.get_${entity}_schema()

      @router.get("/${entity}")
      async def get_${entity}_list(limit: int = 100):            
          return await ${libName}.get_${entity}_list(limit)

      @router.get("/${entity}/{${pkName}}")
      async def get_${entity}(${pkName}: int):
          return await ${libName}.get_${entity}(${pkName})

      @router.post("/${entity}")
      async def create_${entity}(${entity}: ${modelName}):
          return await ${libName}.create_${entity}(${entity}.dict())

      @router.put("/${entity}/{${pkName}}")
      async def update_${entity}(${pkName}: int, ${entity}: ${modelName}):
          return await ${libName}.update_${entity}(${pkName}, ${entity}.dict())

      @router.delete("/${entity}/{${pkName}}")
      async def delete_${entity}(${pkName}: int):
          return await ${libName}.delete_${entity}(${pkName})
    `;

    const libCode = `
      from app.dependencies import db
      from app.schemas.${entity} import ${modelName}

      class ${className}:
          async def generate(self):
              await db.create_schema("${entity}", ${modelName}.schema())

          async def get_${entity}_schema(self):
              return ${modelName}.schema()

          async def get_${entity}_list(self, limit: int = 100):
              ${entity} = await db.fetchall("SELECT * FROM ${entity} LIMIT :limit", {"limit": limit})
              return ${entity}

          async def get_${entity}(self, ${pkName}: int):
              ${entity} = await db.fetchone("SELECT * FROM ${entity} WHERE ${pkName}=:${pkName}", {"${pkName}": ${pkName}})
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

    const types = columns
        .filter((c) => !c.pk)
        .map((c) => {
            if (c.optional) {
                return `${c.name}: Optional[${
                    typeMap[c.type]
                }] = Query(${formatDefault(c)}, title="${
                    c.title || c.name
                }", description="${c.description || ""}" ${
                    c.type === "VARCHAR" && c.typeArg
                        ? ", max_length=" + c.typeArg
                        : ""
                } , optional=true ${c.hideOnForm ? ", hideOnForm=True" : ""})`;
            } else {
                return `${c.name}: ${typeMap[c.type]} = Query(${formatDefault(
                    c
                )}, title="${c.title || c.name}", description="${
                    c.description || ""
                }" ${
                    c.type === "VARCHAR" && c.typeArg
                        ? ", max_length=" + c.typeArg
                        : ""
                } ${c.hideOnForm ? ", hideOnForm=True" : ""})`;
            }
        })
        .join(" \n          ");

    const schemaCode = `
      from pydantic import BaseModel
      from fastapi import Query
      from typing import Optional
      ${needsDatetimeImport ? "import datetime\n" : ""}
      class ${modelName}(BaseModel):          
          ${types}
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
                          c.defaultValue
                              ? " DEFAULT " + formatDefault(c, true)
                              : ""
                      }`
            )
            .join(",\n")}
      );
    `;

    return { mainCode, routerCode, libCode, schemaCode, sqlCode };
}
