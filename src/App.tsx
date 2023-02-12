import { useState } from 'react';
import { CssBaseline, Theme, ThemeProvider } from '@mui/material';

import { ThemeCtrlContext } from './context/themectrl.context';
import lightTheme from './theme/light';
import darkTheme from './theme/dark';
import AppRouter from './components/pages/AppRouter';

// import './App.css';

function App() {
    // TODO: Change with context/redux
    const [currentTheme, setCurrentTheme] = useState<Theme>(getLastTheme() === 'light' ? lightTheme : darkTheme || lightTheme); // Default Theme 

    /**
     * Loading the last theme from the localStoage
     */
     function getLastTheme(): string | null {
        return localStorage.getItem('lastThemeState');
    }

    /**
     * Saving the theme into the localStoage
     */
     function saveTheme(): void {
        console.log('Saving theme...');
        localStorage.setItem('lastThemeState', currentTheme.palette.mode === 'light' ? 'dark' : 'light');
    }

    const toggleTheme = (changeToTheme?: string): void => {
        setCurrentTheme((currentTheme: Theme) => {
            if (changeToTheme) {
                saveTheme();
                return changeToTheme === 'light' ? lightTheme : darkTheme;
            }
            
            saveTheme();
            return currentTheme === lightTheme ? darkTheme : lightTheme;
        });
    }

    return (
        <ThemeProvider theme={currentTheme}>
            {/* Activating the material theming */}
            <CssBaseline />
            
            <ThemeCtrlContext.Provider value={toggleTheme}>
                <AppRouter />
            </ThemeCtrlContext.Provider>
        </ThemeProvider>
    );
}

export default App;
