import { Box, Theme, useTheme } from '@mui/material';
import classes from './LogoNoch.module.css';

const LogoNoch = (): JSX.Element => {
    const theme: Theme = useTheme();

    return (
        <Box className={classes['logo-noch']} 
            display='flex'
            justifyContent='center'
            alignItems='center'
            sx={{ 
                background: theme.palette.primary.main  
            }}>
            <img className={classes.logo} src="https://upload.wikimedia.org/wikipedia/commons/6/69/How_to_use_icon.svg" alt='logo' />
        </Box>
    );
}

export default LogoNoch;