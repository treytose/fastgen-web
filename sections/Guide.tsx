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
                description: "Contains appwide dependencies",
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
                description: "Contains the app routers",
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
                description: "Contains the Pydantic models",
            },
            {
                name: "libraries",
                children: [
                    { name: "__init__.py" },
                    {
                        name: "libcustomer.py",
                        description:
                            "Contains CRUD queries for a customer entity",
                    },
                ],
                description:
                    "Contains library classes for database access and backend logic",
            },
            {
                name: "tools",
                description: "Contains tools for use throughout the app",
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
            {
                name: "data",
                description:
                    "(optional) contains a SQLite3 database file and/or misc. data files",
                children: [
                    {
                        name: "database.db",
                        description: "Example Sqlite3 databse file",
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
                        <strong> 1. </strong> Generate a base FastAPI
                        application using the API generator
                    </Typography>
                    <Typography>
                        <strong> 2. </strong> Connect the FastGen application to
                        your newly created FastAPI.
                        <br />
                        <small style={{ marginLeft: "2rem" }}>
                            (This happens automatically upon API creation){" "}
                        </small>
                    </Typography>
                    <Typography>
                        <strong> 3. </strong> Create entities using the Entity
                        Generator to quickly add CRUD routes to your API
                    </Typography>
                    <Typography>
                        <strong> 4. </strong> Edit as needed
                    </Typography>
                    <Typography sx={{ marginTop: "3rem" }}>
                        FastGen provides the following:
                    </Typography>
                    <ul>
                        <li> RESTful API generation (CRUD) </li>
                        <li> Automatic SQL table creation </li>
                        <li>
                            Automatic form generation (using the FastForm
                            component)
                        </li>
                    </ul>
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
