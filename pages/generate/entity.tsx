import { useRef, useState } from "react";
import { Typography, Grid, TextField, Stack } from "@mui/material";

import Card from "../../components/Card";
import Code from "../../components/Code";

const Entity = () => {
    const entityRef = useRef<HTMLInputElement>(null);
    const blueprintRef = useRef<HTMLInputElement>(null);
    const [code, setCode] = useState<string>("");

    const generateEntityAPI = () => {
        const entity =
            entityRef.current !== null ? entityRef.current.value : "";
        const blueprint =
            blueprintRef.current !== null
                ? blueprintRef.current.value || "app"
                : "";

        const code = `
            @${blueprint}.get("/${entity}/${entity}id")
            async def get_${entity}(${entity}id: int):
                return {}        
        `;

        setCode(code);
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Card sx={{ height: "100%" }}>
                        <Typography variant="h6">Configuration</Typography>
                        <Stack spacing={2}>
                            <TextField
                                variant="standard"
                                label="Entity"
                                inputRef={entityRef}
                                onChange={generateEntityAPI}
                            />
                            <TextField
                                variant="standard"
                                label="Decorator"
                                inputRef={blueprintRef}
                                onChange={generateEntityAPI}
                            />
                        </Stack>
                    </Card>
                </Grid>
                <Grid item xs={8}>
                    <Card sx={{ height: "100%" }}>
                        <Typography variant="h6">Output</Typography>
                        {code && <Code code={code} />}
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default Entity;
