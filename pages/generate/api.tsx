import { useRef, useState, useContext } from "react";
import axios from "axios";
import {
    Container,
    Grid,
    Button,
    Stack,
    Typography,
    TextField,
    Alert,
} from "@mui/material";
import ColumnCard from "../../components/ColumnCard";
import { useRouter } from "next/router";
import AppContext from "../../store/AppContext";

const API = () => {
    const nameRef = useRef<HTMLInputElement>();
    const pathRef = useRef<HTMLInputElement>();
    const [error, setError] = useState<string>("");
    const router = useRouter();
    const appCtx = useContext(AppContext);

    const handleSubmit = () => {
        const name = nameRef.current !== undefined ? nameRef.current.value : "";
        const path = pathRef.current !== undefined ? pathRef.current.value : "";
        if (name === "" || path === "") {
            return;
        }

        axios
            .post("/api/fastgen_api", { name, path })
            .then((res) => {
                setError("");
                appCtx.setApiName(name);
                router.push("/");
            })
            .catch((error) => {
                console.log(error);
                setError(error.response.data.detail);
            });
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                    <ColumnCard>
                        <Stack spacing={2}>
                            {error && <Alert severity="error"> {error} </Alert>}
                            <Typography variant="h6">
                                Create a new Fast API
                            </Typography>

                            <TextField
                                variant="standard"
                                label="API Name"
                                inputRef={nameRef}
                            />
                            <TextField
                                variant="standard"
                                label="Absolute Path"
                                inputRef={pathRef}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                Create
                            </Button>
                        </Stack>
                    </ColumnCard>
                </Grid>
            </Grid>
        </Container>
    );
};

export default API;
