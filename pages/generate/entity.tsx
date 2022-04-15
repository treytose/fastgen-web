import { useRef, useState, useEffect } from "react";
import { Typography, Grid, TextField, Stack, Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

// components
import ColumnCard from "../../components/ColumnCard";
import Code from "../../components/Code";
import EntityColumn, { EColumn } from "../../components/entity/EntityColumn";

import { toTitle } from "../../util";

const Entity = () => {
  const entityRef = useRef<HTMLInputElement>(null);
  const [entity, setEntity] = useState<string>("");
  const [mainCode, setMainCode] = useState<string>("");
  const [routerCode, setRouterCode] = useState<string>("");
  const [libCode, setLibCode] = useState<string>("");
  const [schemaCode, setSchemaCode] = useState<string>("");
  const [sqlCode, setSqlCode] = useState<string>("");
  const [columns, setColumns] = useState<EColumn[]>([]);

  const handleAddColumn = () => {
    setColumns((columns) => {
      if (columns.length > 0 && columns[columns.length - 1].name === "") {
        return columns;
      }

      columns.push({ name: "", type: "VARCHAR", typeArg: "64" });
      return [...columns];
    });
  };

  const handleColumnUpdate = (index: number, ec: EColumn) => {
    setColumns((columns) => {
      if (columns.length > index) {
        columns[index] = ec;
      }
      return [...columns];
    });
  };

  const handleColumnDelete = (index: number) => {
    setColumns((columns) => {
      if (columns.length > index) {
        columns.splice(index, 1);
      }
      return [...columns];
    });
  };

  const handleEntityChange = () => {
    const entity = entityRef.current !== null ? entityRef.current.value : "";
    const pkName = `${entity}id`;
    setEntity(entity);
    setColumns((columns) => {
      if (columns.length === 0) {
        return [{ name: pkName, type: "INT", pk: true }];
      }

      columns[0] = { name: pkName, type: "INT", pk: true };
      return [...columns];
    });
  };

  useEffect(() => {
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

        @router.get("/${entity}")
        async def get_${entity}_list(limit: int = 100):            
            return await ${libName}.get_${entity}_list(limit)

        @router.get("/${entity}/${pkName}")
        async def get_${entity}(${pkName}: int):
            return await ${libName}.get_${entity}(${pkName})

        @router.post("/${entity}")
        async def create_${entity}(${entity}: ${modelName}):
            return await ${libName}.create_${entity}(${entity}.dict())

        @router.put("/${entity}/${pkName}")
        async def update_${entity}(${pkName}: int, ${entity}: ${modelName}):
            return await ${libName}.update_${entity}(${pkName}, ${entity}.dict())

        @router.delete("/${entity}/${pkName}")
        async def delete_${entity}(${pkName}: int):
            return await ${libName}.delete_${entity}(${pkName})
    `;

    const libCode = `
        from app.dependencies import db
        from app.schemas.${entity} import ${modelName}

        class ${className}:
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
    };

    const needsDatetimeImport = columns.map((c) => c.type).includes("DATETIME");

    const types = columns
      .filter((c) => !c.pk)
      .map((c) => `${c.name}: ${typeMap[c.type]}`)
      .join(" \n          ");

    const schemaCode = `
      from pydantic import BaseModel
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
                }`
          )
          .join(",\n")}
      );
    `;

    setMainCode(mainCode);
    setRouterCode(routerCode);
    setLibCode(libCode);
    setSchemaCode(schemaCode);
    setSqlCode(sqlCode);
  }, [entity, columns]);

  const RenderStep = (
    title: string,
    code: string,
    language?: string = "Python"
  ) => {
    return (
      <>
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
        <Code code={code} language={language} />
      </>
    );
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ColumnCard title="Configuration">
            <Stack spacing={2}>
              <Typography variant="h6" color="primary">
                Entity Name
              </Typography>
              <TextField
                variant="standard"
                inputRef={entityRef}
                onChange={handleEntityChange}
                placeholder="Entity name"
              />
              <br />
              <Typography variant="h6" color="primary">
                Columns
              </Typography>
              {columns.map((c, index) => (
                <EntityColumn
                  key={c.name}
                  ecolumn={c}
                  onUpdate={handleColumnUpdate}
                  onDelete={handleColumnDelete}
                  allowEdit={!c.pk}
                  index={index}
                />
              ))}

              {columns.length > 0 && (
                <Button variant="contained" onClick={handleAddColumn}>
                  <AddBoxIcon sx={{ marginRight: "0.5rem" }} />
                  <Typography> Add Column </Typography>
                </Button>
              )}
            </Stack>
          </ColumnCard>
        </Grid>
        <Grid item xs={8}>
          <ColumnCard title="Output">
            {entity && (
              <>
                {RenderStep(`Register : Add to app/main.py`, mainCode)}
                <br />
                {RenderStep(
                  `Router : Create app/routers/${entity}.py`,
                  routerCode
                )}
                <br />
                {RenderStep(
                  `Library : Create app/libraries/lib${entity}.py`,
                  libCode
                )}
                <br />
                {RenderStep(
                  `Schema : Create to app/schemas/${entity}.py`,
                  schemaCode
                )}
                <br />
                {RenderStep(`SQL : Create Table`, sqlCode, "SQL")}
              </>
            )}
          </ColumnCard>
        </Grid>
      </Grid>
    </>
  );
};

export default Entity;
