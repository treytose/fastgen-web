import { FC } from "react";
import { Box, Theme, CircularProgress } from "@mui/material";

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
      <CircularProgress />
    </Box>
  );
};

export default PageLoading;
