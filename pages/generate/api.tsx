import { useRef, useContext } from "react";
import {
  Container,
  Grid,
  Button,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import ColumnCard from "../../components/ColumnCard";

const API = () => {
  const nameRef = useRef<HTMLInputElement>();
  const pathRef = useRef<HTMLInputElement>();

  const handleSubmit = () => {
    const name = nameRef.current !== undefined ? nameRef.current.value : "";
    const path = pathRef.current !== undefined ? pathRef.current.value : "";
    if (name === "" || path === "") {
      return;
    }

    fetch("/api/createTemplate", {
      method: "POST",
      body: JSON.stringify({
        name,
        path,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <ColumnCard>
            <Stack spacing={2}>
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
              <Button fullWidth variant="contained" onClick={handleSubmit}>
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
