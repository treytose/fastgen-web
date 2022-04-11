import React, { FC, useContext } from 'react';
import { ThemeProvider } from '@mui/material';

import SettingsContext from '../store/SettingsContext';

const Wrapper: FC<{children: React.ReactNode}> = ({children}) => {
    const settingsCtx = useContext(SettingsContext);

    return (
        <>            
            <ThemeProvider theme={settingsCtx.theme.theme}>   
                { children }
            </ThemeProvider>      
        </>
    )
}

export default Wrapper;