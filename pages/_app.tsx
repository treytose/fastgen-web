import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import Wrapper from "../components/Wrapper";
import { SettingsProvider } from "../store/SettingsContext";
import { AppContextProvider } from "../store/AppContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SettingsProvider>
      <AppContextProvider>
        <Wrapper>
          <CssBaseline />
          <Component {...pageProps} />
        </Wrapper>
      </AppContextProvider>
    </SettingsProvider>
  );
}

export default MyApp;
