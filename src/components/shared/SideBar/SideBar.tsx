import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Theme, useTheme } from "@mui/material";
import { Menu as MenuIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon, Settings as SettingsIcon } from '@mui/icons-material';

import { ThemeCtrlContext } from "../../../context/themectrl.context";

const SideBar = (): JSX.Element => {
    const theme: Theme = useTheme();
    const navigate: NavigateFunction = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleDrawer = (state: boolean): void => {
        setIsOpen(state);
    }

    return (
        <>
            <IconButton onClick={() => toggleDrawer(true)}>
                <MenuIcon />
            </IconButton>
            
            <Drawer anchor='left'
                open={isOpen}
                onClose={() => toggleDrawer(false)}>
                <List>
                    <ThemeCtrlContext.Consumer>
                        {(themeToggle) => {
                            const handleThemeChange = (): void => {
                                theme.palette.mode === 'dark' ? 
                                    themeToggle('light') 
                                : themeToggle('dark'); 
                            }

                            return (
                                <>
                                    <ListItemButton onClick={handleThemeChange}>
                                        <ListItemIcon>
                                            { theme.palette.mode === 'dark' && <DarkModeIcon /> }
                                            { theme.palette.mode === 'light' && <LightModeIcon /> } 
                                        </ListItemIcon>
                                        <ListItemText>
                                            { theme.palette.mode === 'dark' && 'Dark Theme' }
                                            { theme.palette.mode === 'light' && 'Light Theme' } 
                                        </ListItemText>
                                    </ListItemButton>
                                    <ListItemButton onClick={() => navigate('/settings')}>
                                        <ListItemIcon>
                                            <SettingsIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            Settings page
                                        </ListItemText>
                                    </ListItemButton>
                                </>
                            );
                        }}
                    </ThemeCtrlContext.Consumer>
                </List>
            </Drawer>
        </>
    );
}

export default SideBar;