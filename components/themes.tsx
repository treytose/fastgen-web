import { createTheme, Theme } from "@mui/material/styles";


export type ThemeSelection = {
    name: string
    theme: Theme
}

const darkTheme = createTheme({
    palette: {    
        primary: {
            main: '#1D2c33'            
        },
        secondary: {
            main: '#7ba3c5',
        },
        background: {
            default: '#17474f',
            paper: '#516e7a',
        },
        error: {
            main: '#b33229',
        },
    }
});  


const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#03A9F4'            
        },
        secondary: {
            main: '#607D8B'
        },
        background: {
            default: '#607D8B',
            paper: '#FFFFFF'
        }
    }
})

export const themes: {[key: string]: ThemeSelection} = {
    "default": {name: "default", theme: defaultTheme},
    "dark": {name: "dark", theme: darkTheme}
};