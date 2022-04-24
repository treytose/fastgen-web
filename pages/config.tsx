import { useEffect, useCallback, useContext, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";
import AppContext, { FastgenAPI } from "../store/AppContext";

import ColumnCard from "../components/ColumnCard";

const Config = () => {
  const router = useRouter();
  const appCtx = useContext(AppContext);
  const [apiList, setApiList] = useState<FastgenAPI[]>([]);

  const onApiSelected = (api: FastgenAPI) => {
    appCtx.setAPI(api);
  };

  const fetchAPIs = useCallback(() => {
    axios.get("/api/fastgen_api").then((resp) => {
      console.log(resp);
      setApiList(resp.data.map((api: FastgenAPI) => api));
    });
  }, []);

  useEffect(() => {
    if (!appCtx.apiConnected) {
      router.push("/");
      return;
    }
    fetchAPIs();
  }, []);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ColumnCard title="Select an API to Configure">
            <List>
              {apiList.map((api) => (
                <ListItem key={api.fastgen_apiid}>
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
  );
};

export default Config;
