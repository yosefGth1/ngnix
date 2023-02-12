import { createTheme, Theme } from "@mui/material";
import { green } from "@mui/material/colors";

const darkTheme: Theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: green[900],
            paper: green[900]
        },
        primary: {
            main: '#fff'
        },
    }
});

export default darkTheme;