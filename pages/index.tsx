import type { NextPage } from "next";
import Link from "next/link";
import { Container, Grid, Paper, Button } from "@mui/material";
import ThemeSelection from "../components/ThemeSelect";

const Home: NextPage = () => {
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Paper sx={{ padding: "3rem" }}>
                        <Link href="/generate/entity">                            
                            <Button variant="contained">                                
                                Create Entity
                            </Button>
                        </Link>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <ThemeSelection />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
