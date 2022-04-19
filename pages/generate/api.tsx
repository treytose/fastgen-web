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
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import ColumnCard from "../../components/ColumnCard";
import { useRouter } from "next/router";
import AppContext from "../../store/AppContext";

const API = () => {
  const nameRef = useRef<HTMLInputElement>();
  const pathRef = useRef<HTMLInputElement>();
  const [pythonVersion, setPythonVersion] = useState<string>("python3.9");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const appCtx = useContext(AppContext);

  const handleSubmit = () => {
    const name = nameRef.current !== undefined ? nameRef.current.value : "";
    const path = pathRef.current !== undefined ? pathRef.current.value : "";
    if (name === "" || path === "") {
      return;
    }

    setLoading(true);
    axios
      .post("/api/fastgen_api", { name, path, pythonVersion })
      .then((res) => {
        setLoading(false);
        setError("");
        appCtx.setApiName(name);
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setError(error.response.data.detail);
      });
  };

  const handleVersionChange = (event: SelectChangeEvent) => {
    setPythonVersion(event.target.value as string);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <ColumnCard>
            {loading ? (
              <Typography variant="h5"> Loading </Typography>
            ) : (
              <Stack spacing={2}>
                {error && <Alert severity="error"> {error} </Alert>}
                <Typography variant="h6">Create a new Fast API</Typography>

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
                <br />
                <Typography> Python Version </Typography>
                <Select
                  onChange={handleVersionChange}
                  label="Python Version"
                  variant="standard"
                  value={pythonVersion}
                >
                  <MenuItem value="python3.6"> Python 3.6 </MenuItem>
                  <MenuItem value="python3.9"> Python 3.9 </MenuItem>
                </Select>
                <Button fullWidth variant="contained" onClick={handleSubmit}>
                  Create
                </Button>
              </Stack>
            )}
          </ColumnCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default API;
