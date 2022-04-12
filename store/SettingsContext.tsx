import React, { useEffect, useState } from "react";
import { createContext, FC } from "react";
import { themes, type ThemeSelection } from "../themes/themes";

type Settings = {
    theme: ThemeSelection;
    setTheme: Function;
};

const defaultSettings: Settings = {
    theme: themes.default,
    setTheme: () => {},
};

const SettingsContext = createContext<Settings>({
    ...defaultSettings,
});

export const SettingsProvider: FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [theme, setTheme] = useState(themes.default);
    const contextValue: Settings = {
        theme,
        setTheme,
    };

    useEffect(() => {
        const preferredThemeName =
            localStorage.getItem("preferred-theme") || "default";
        const preferredTheme =
            preferredThemeName in themes
                ? themes[preferredThemeName]
                : themes.default;
        setTheme(preferredTheme);
    }, []);

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
