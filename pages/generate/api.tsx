import { useRef, useState, useContext } from "react";
import { Container, Grid } from "@mui/material";
import ColumnCard from "../../components/ColumnCard";
import { useRouter } from "next/router";
import AppContext from "../../store/AppContext";
import FastForm from "../../components/FastForm";

const API = () => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <ColumnCard>
            <FastForm entity="fastgen_api" />
          </ColumnCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default API;
