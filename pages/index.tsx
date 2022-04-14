import type { NextPage } from "next";
import Link from "next/link";
import { Container, Grid, Button, Typography } from "@mui/material";
import ThemeSelection from "../sections/ThemeSelect";
import Guide from "../sections/Guide";

// components
import ColumnCard from "../components/ColumnCard";

const Home: NextPage = () => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <ColumnCard title="Tools">
            <Link href="/generate/entity">
              <Button variant="contained">Create Entity</Button>
            </Link>
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
