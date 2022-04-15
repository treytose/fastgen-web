import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import Wrapper from "../components/Wrapper";
import { SettingsProvider } from "../store/SettingsContext";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SettingsProvider>
            <Wrapper>
                <CssBaseline />
                <Component {...pageProps} />
            </Wrapper>
        </SettingsProvider>
    );
}

export default MyApp;
