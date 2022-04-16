import { useRef, useState, useEffect } from "react";
import { Typography, Grid, TextField, Stack, Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

// components
import ColumnCard from "../../components/ColumnCard";
import Code from "../../components/Code";
import EntityColumn, { EColumn } from "../../components/entity/EntityColumn";

import generateCode from "../../util/codeGenerator";

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
        const entity =
            entityRef.current !== null ? entityRef.current.value : "";
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
        const { mainCode, routerCode, libCode, schemaCode, sqlCode } =
            generateCode(entity, columns);
        setMainCode(mainCode);
        setRouterCode(routerCode);
        setLibCode(libCode);
        setSchemaCode(schemaCode);
        setSqlCode(sqlCode);
    }, [entity, columns]);

    const RenderStep = (
        title: string,
        code: string,
        language: string = "Python"
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
                <Grid item xs={5}>
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
                                <Button
                                    variant="contained"
                                    onClick={handleAddColumn}
                                >
                                    <AddBoxIcon
                                        sx={{ marginRight: "0.5rem" }}
                                    />
                                    <Typography> Add Column </Typography>
                                </Button>
                            )}
                        </Stack>
                    </ColumnCard>
                </Grid>
                <Grid item xs={7}>
                    <ColumnCard title="Output">
                        {entity && (
                            <>
                                {RenderStep(
                                    `Register : Add to app/main.py`,
                                    mainCode
                                )}
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
                                {RenderStep(
                                    `SQL : Create Table`,
                                    sqlCode,
                                    "SQL"
                                )}
                            </>
                        )}
                    </ColumnCard>
                </Grid>
            </Grid>
        </>
    );
};

export default Entity;
