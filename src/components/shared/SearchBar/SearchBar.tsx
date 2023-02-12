import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';

export interface ISearchBarProps {
    onCameraClicked?: () => void;
}

const SearchBar = (props: ISearchBarProps): JSX.Element => {
    return (
        <Paper component='form'
            sx={{ 
                p: '2px 4px', 
                display: 'flex', 
                alignItems: 'center', 
                width: 400 
            }}>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Write a name here"
                inputProps={{ 'aria-label': 'write a name here' }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton onClick={() => props.onCameraClicked ? props.onCameraClicked() : null} 
                sx={{ p: '10px' }} 
                aria-label="Search by photo">
                <CameraAltIcon />
            </IconButton>
        </Paper>
    );
}

export default SearchBar;