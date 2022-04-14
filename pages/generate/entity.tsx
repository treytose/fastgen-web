import { useRef, useState } from "react";
import { Typography, Grid, TextField, Stack } from "@mui/material";

import ColumnCard from "../../components/ColumnCard";
import Code from "../../components/Code";

const Entity = () => {
  const entityRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState<string>("");

  const generateEntityAPI = () => {
    const entity = entityRef.current !== null ? entityRef.current.value : "";

    const code = `
            @router.get("/${entity}/${entity}id")
            async def get_${entity}(${entity}id: int):
                return {}        
        `;

    setCode(code);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ColumnCard title="Configuration">
            <Stack spacing={2}>
              <TextField
                variant="standard"
                label="Entity"
                inputRef={entityRef}
                onChange={generateEntityAPI}
              />
            </Stack>
          </ColumnCard>
        </Grid>
        <Grid item xs={8}>
          <ColumnCard title="Output">
            {code ? <Code code={code} /> : <Typography> no output </Typography>}
          </ColumnCard>
        </Grid>
      </Grid>
    </>
  );
};

export default Entity;
