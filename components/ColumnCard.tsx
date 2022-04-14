import React, { FC } from "react";
import { Paper, Typography, Box } from "@mui/material";
import CSS from "csstype";

type props = {
  children: React.ReactNode;
  sx?: CSS.Properties;
  title?: string;
};

const ColumnCard: FC<props> = ({ children, sx, title = "" }) => {
  return (
    <Paper sx={{ padding: "2rem 2rem", height: "100%", ...sx }}>
      <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
        {title}
      </Typography>
      <Box
        sx={{
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default ColumnCard;
