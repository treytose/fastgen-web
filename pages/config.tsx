import { useEffect, useCallback, useContext, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Alert,
  IconButton,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useRouter } from "next/router";
import AppContext, { FastgenAPI } from "../store/AppContext";

import ColumnCard from "../components/ColumnCard";

const Config = () => {
  const router = useRouter();
  const appCtx = useContext(AppContext);
  const [apiList, setApiList] = useState<FastgenAPI[]>([]);
  const [error, setError] = useState<string>("");
  const [notification, setNotification] = useState<string>("Test");

  const onApiSelected = (api: FastgenAPI) => {
    appCtx.setAPI(api);
  };

  const fetchAPIs = useCallback(() => {
    axios.get("/api/fastgen_api").then((resp) => {
      console.log(resp);
      setApiList(resp.data.map((api: FastgenAPI) => api));
    });
  }, []);

  const handleDelete = (fastgen_apiid: number) => {
    axios
      .delete("/api/fastgen_api/" + fastgen_apiid)
      .then((resp) => {
        console.log(resp);
        setNotification(
          "API link deleted. (Note: This did not delete the API on the server.)"
        );
        fetchAPIs();
      })
      .catch((error) => {
        console.log(error);
        setError(error.detail);
      });
  };

  const handleSnackbarClose = () => {
    setNotification("");
  };

  useEffect(() => {
    if (!appCtx.apiConnected) {
      router.push("/");
      return;
    }
    fetchAPIs();
  }, []);

  return (
    <>
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        message={notification}
        onClose={handleSnackbarClose}
        severity="success"
      />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {error && (
              <Alert severity="error" sx={{ marginBottom: "1rem" }}>
                {error}
              </Alert>
            )}
            <ColumnCard title="Select an API to Configure">
              <List>
                {apiList.map((api) => (
                  <ListItem
                    key={api.fastgen_apiid}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        sx={{ color: "error.main" }}
                        onClick={() => {
                          handleDelete(api.fastgen_apiid);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      selected={appCtx.api && appCtx.api.name === api.name}
                      onClick={(e) => onApiSelected(api)}
                    >
                      <ListItemText primary={api.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              {apiList.length === 0 && (
                <h5> You have not created any APIs yet. </h5>
              )}
            </ColumnCard>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Config;
