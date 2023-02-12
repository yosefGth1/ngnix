import { createTheme, Theme } from "@mui/material";
import { green, grey } from "@mui/material/colors";

const lightTheme: Theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: grey[100]
        },
        primary: {
            main: green[900]
        },
        text: {
            primary: green[900],
            secondary: green[800]
        },
        
    }
});

export default lightTheme;