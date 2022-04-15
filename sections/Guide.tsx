import { Typography, Grid } from "@mui/material";
import FileTree, { type Tree } from "../components/FileTree";
import ColumnCard from "../components/ColumnCard";

const Guide = () => {
    const projectStructure: Tree = {
        id: "app",
        name: "app",
        description: "The base application",
        children: [
            {
                name: "__init__.py",
            },
            {
                name: "main.py",
                description: "The application is initalized here",
            },
            {
                name: "dependencies.py",
                description: "App dependencies go here",
            },
            {
                name: "routers",
                children: [
                    { name: "__init__.py" },
                    {
                        name: "customer.py",
                        description: "This is an example customer router",
                    },
                ],
                description: "App routers go in here",
            },
            {
                name: "schemas",
                children: [
                    { name: "__init__.py" },
                    {
                        name: "customer.py",
                        description: "This contains the CustomerModel class",
                    },
                ],
                description: "Pydantic models go in here",
            },
            {
                name: "libraries",
                children: [
                    { name: "__init__.py" },
                    {
                        name: "libcustomer.py",
                        description:
                            "This file contains the CRUD queries for a customer entity",
                    },
                ],
                description:
                    "This is where the database queries and other backend logic are created",
            },
            {
                name: "tools",
                description:
                    "This package contains helpful libraries used through the app",
                children: [
                    { name: "__init__.py" },
                    {
                        name: "asyncdb.py",
                        description: "Helper class for async database access",
                    },
                    {
                        name: "p3log.py",
                        description: "Helper class for logging",
                    },
                    {
                        name: "p3tools.py",
                        description: "Contains various helpful methods",
                    },
                ],
            },
        ],
    };

    return (
        <ColumnCard>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6"> How it Works </Typography>
                    <Typography>
                        FastGen generates ORMless FastAPI code.
                    </Typography>
                    <Typography> The entity generator will create: </Typography>
                    <ul>
                        <li> CRUD APIs </li>
                        <li> SQL Queries </li>
                        <li> Pydantic Schemas </li>
                    </ul>
                    <Typography>
                        allowing you to quickly generate clean and consistent
                        code.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6"> Project Structure </Typography>
                    <Typography>
                        This project structure must be maintained for relability
                        of FastGen code generation
                    </Typography>
                    <hr />
                    <FileTree tree={projectStructure} expanded={["app"]} />
                </Grid>
            </Grid>
        </ColumnCard>
    );
};

export default Guide;
