import { Typography, Grid } from "@mui/material";
import FileTree, { type Tree } from "../components/FileTree";
import ColumnCard from "../components/ColumnCard";

const Guide = () => {
  const projectStructure: Tree[] = [
    {
      name: "app",
      children: [
        {
          name: "libraries",
          children: [{ name: "__init__.py" }, { name: "libcustomer.py" }],
        },
        {
          name: "routers",
          children: [{ name: "__init__.py" }, { name: "customer.py" }],
        },
        {
          name: "schemas",
          children: [{ name: "__init__.py" }, { name: "customer.py" }],
        },
        {
          name: "tools",
          children: [
            { name: "__init__.py" },
            { name: "asyncdb.py" },
            { name: "p3log.py" },
            { name: "p3tools.py" },
          ],
        },
        {
          name: "__init__.py",
        },
        {
          name: "dependencies.py",
        },
        {
          name: "main.py",
        },
      ],
    },
  ];

  return (
    <ColumnCard title="How it Works">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography> FastGen generates ORMless FastAPI code. </Typography>

          <br />
          <Typography> The entity generator will create: </Typography>
          <ul>
            <li> CRUD APIs </li>
            <li> SQL Queries </li>
            <li> Pydantic Schemas </li>
          </ul>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6"> Project Structure </Typography>
          <Typography>
            This project structure must be maintained for relability of FastGen
            code generation
          </Typography>
          <FileTree tree={projectStructure} />
        </Grid>
      </Grid>
    </ColumnCard>
  );
};

export default Guide;
