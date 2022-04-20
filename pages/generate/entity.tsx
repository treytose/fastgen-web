import { useRef, useState, useEffect, useContext } from "react";
import {
  Typography,
  Grid,
  TextField,
  Stack,
  Button,
  Box,
  Tooltip,
  Alert,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import AddBoxIcon from "@mui/icons-material/AddBox";

// components
import ColumnCard from "../../components/ColumnCard";
import Code from "../../components/Code";
import EntityColumn, { EColumn } from "../../components/entity/EntityColumn";

import AppContext from "../../store/AppContext";
import generateCode from "../../util/codeGenerator";

const Entity = () => {
  const appCtx = useContext(AppContext);
  const [error, setError] = useState<string>("");
  const [notification, setNotification] = useState<string>("");

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

      columns.push({
        name: "",
        type: "VARCHAR",
        typeArg: "64",
        optional: false,
      });
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
        return [{ name: pkName, type: "INT", pk: true, optional: false }];
      }

      columns[0] = {
        name: pkName,
        type: "INT",
        pk: true,
        optional: false,
      };
      return [...columns];
    });
  };

  const handleInject = () => {
    if (!appCtx.api) {
      return;
    }
    console.log(appCtx.api);

    const { mainCode, routerCode, libCode, schemaCode, sqlCode } = generateCode(
      entity,
      columns
    );

    axios
      .post(`/api/fastgen_api/${appCtx.api.fastgen_apiid}/inject`, {
        name: entity,
        router_code: routerCode,
        main_code: mainCode,
        lib_code: libCode,
        schema_code: schemaCode,
      })
      .then((resp) => {
        console.log(resp);
        setError("");
        setNotification(`${entity} Injected successfully`);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        setNotification("");
        setError(error.message);
      });
  };

  useEffect(() => {
    const { mainCode, routerCode, libCode, schemaCode, sqlCode } = generateCode(
      entity,
      columns
    );
    setMainCode(mainCode);
    setRouterCode(routerCode);
    setLibCode(libCode);
    setSchemaCode(schemaCode);
    setSqlCode(sqlCode);
  }, [entity, columns]);

  type Step = {
    title: string;
    code: string;
    language: string;
  };

  const RenderStep = (step: Step, key: number) => {
    return (
      <Box key={key} sx={{ marginBottom: "2rem" }}>
        <Typography variant="h6" color="primary">
          {step.title}
        </Typography>
        <Code code={step.code} language={step.language} />
      </Box>
    );
  };

  const steps: Step[] = [
    {
      title: "Register : Add to app/main.py",
      code: mainCode,
      language: "python",
    },
    {
      title: `Schema : Create to app/schemas/${entity}.py`,
      code: schemaCode,
      language: "python",
    },
    {
      title: `Router : Create app/routers/${entity}.py`,
      code: routerCode,
      language: "python",
    },
    {
      title: `Library : Create app/libraries/lib${entity}.py`,
      code: libCode,
      language: "python",
    },
    {
      title: `SQL : Create Table`,
      code: sqlCode,
      language: "SQL",
    },
  ];

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
                <Button variant="contained" onClick={handleAddColumn}>
                  <AddBoxIcon sx={{ marginRight: "0.5rem" }} />
                  <Typography> Add Column </Typography>
                </Button>
              )}
            </Stack>
          </ColumnCard>
        </Grid>
        <Grid item xs={7}>
          <ColumnCard>
            {error && (
              <Alert sx={{ marginBottom: "1rem" }} severity="error">
                {error}
              </Alert>
            )}

            {notification && (
              <Alert sx={{ marginBottom: "1rem" }} severity="success">
                {notification}
              </Alert>
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5"> Output </Typography>
              {entity && (
                <Tooltip
                  title={
                    appCtx.api
                      ? `Inject into ${appCtx.api.name}`
                      : `Connect to an API in order to inject this code`
                  }
                >
                  <Button
                    variant="contained"
                    color={appCtx.api ? "success" : "error"}
                    onClick={handleInject}
                  >
                    Inject into API
                  </Button>
                </Tooltip>
              )}
            </Box>
            {entity && steps.map((step, i) => RenderStep(step, i))}
          </ColumnCard>
        </Grid>
      </Grid>
    </>
  );
};

export default Entity;
