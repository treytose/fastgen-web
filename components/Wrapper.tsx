import React, { FC, useContext, useEffect, useState } from "react";
import { ThemeProvider, Container, Box } from "@mui/material";

import SettingsContext from "../store/SettingsContext";
import AppContext from "../store/AppContext";
import PageLoading from "./PageLoading";
import Header from "./Header";

const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  const settingsCtx = useContext(SettingsContext);
  const appCtx = useContext(AppContext);

  return (
    <>
      {appCtx.pageLoaded ? (
        <ThemeProvider theme={settingsCtx.theme.theme}>
          <Container maxWidth={false} disableGutters>
            <Header />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "3rem",
              }}
            >
              {children}
            </Box>
          </Container>
        </ThemeProvider>
      ) : (
        <PageLoading theme={settingsCtx.theme.theme} />
      )}
    </>
  );
};

export default Wrapper;
