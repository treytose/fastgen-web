import { useEffect, useState, useContext } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { Container, Grid, Button, Stack, Tooltip } from "@mui/material";
import ThemeSelection from "../sections/ThemeSelect";
import Guide from "../sections/Guide";

// components
import ColumnCard from "../components/ColumnCard";

import AppContext from "../store/AppContext";

const Home: NextPage = () => {
  const appCtx = useContext(AppContext);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <ColumnCard title="Tools">
            <Stack direction="row" spacing={2}>
              <Link href="/generate/entity">
                <Button variant="contained">Create Entity</Button>
              </Link>
              <Link href="/generate/api">
                <Button disabled={!appCtx.apiConnected} variant="contained">
                  Create new API
                </Button>
              </Link>
              <Tooltip title="not available">
                <Button variant="contained" disabled>
                  Connect to API
                </Button>
              </Tooltip>
            </Stack>
          </ColumnCard>
        </Grid>
        <Grid item xs={4}>
          <ThemeSelection />
        </Grid>
        <Grid item xs={12}>
          <Guide />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
