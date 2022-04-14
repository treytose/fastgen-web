import type { NextPage } from "next";
import Link from "next/link";
import { Container, Grid, Button } from "@mui/material";
import ThemeSelection from "../components/ThemeSelect";

// components
import Card from "../components/Card";

const Home: NextPage = () => {
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Card sx={{ height: "100%" }}>
                        <Link href="/generate/entity">
                            <Button variant="contained">Create Entity</Button>
                        </Link>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <ThemeSelection />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
