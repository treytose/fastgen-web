import { useRef, useState, useContext } from "react";
import { Container, Grid, Typography } from "@mui/material";
import ColumnCard from "../../components/ColumnCard";
import AppContext from "../../store/AppContext";
import FastForm from "../../components/FastForm";

const API = () => {
  const appCtx = useContext(AppContext);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <ColumnCard>
            {appCtx.apiConnected ? (
              <FastForm entity="fastgen_api" />
            ) : (
              <Typography>
                You must enable the API to use this feature.
              </Typography>
            )}
          </ColumnCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default API;
