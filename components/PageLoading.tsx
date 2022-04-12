import { FC } from "react";
import { Box, Theme, Typography } from "@mui/material";

const PageLoading: FC<{ theme: Theme }> = ({ theme }) => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography> Loading </Typography>
    </Box>
  );
};

export default PageLoading;
