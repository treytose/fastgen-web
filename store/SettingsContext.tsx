import React, { useState } from "react";
import { createContext, FC } from "react";
import { themes, type ThemeSelection } from "../components/themes";



type Settings = {
    theme: ThemeSelection
    setTheme: Function
}

const defaultSettings: Settings = {
    theme: themes.dark,
    setTheme: () => { console.log("RAN"); }
}

const SettingsContext = createContext<Settings>({
    ...defaultSettings
});


export const SettingsProvider: FC<{children: React.ReactNode}> = ({children}) => {

    const [theme, setTheme] = useState(themes.dark);

    const contextValue: Settings = {
        theme, 
        setTheme
    }

    return (
        <SettingsContext.Provider value={contextValue}>
            { children }
        </SettingsContext.Provider>
    )
}

export default SettingsContext;