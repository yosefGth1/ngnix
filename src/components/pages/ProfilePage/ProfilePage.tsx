import { Box, ButtonBase, Card, CardContent, CardMedia, Typography } from "@mui/material";

import classes from './ProfilePage.module.css';

const ProfilePage = (): JSX.Element => {
    const name: string = 'Jhon doe';
    const biography: string = `This is long biography of Jhon doe`;

    return (
        <div className={classes['page-content']}>
            <h1>{name}</h1>
            <Typography>{biography}</Typography>

            <Box className={classes['tile-box']}>
                <Card>
                    <ButtonBase onClick={() => console.log('clicked on pictures ref')}>
                        <CardMedia component='img' 
                            image='' 
                            alt='logo' />
                        <CardContent>
                            <Typography>Pictures of {name}</Typography>
                        </CardContent>
                    </ButtonBase>
                </Card>
                <Card>
                    <ButtonBase onClick={() => console.log('videos')}>
                        <CardMedia component='img' 
                            image='' 
                            alt='logo' />
                        <CardContent>
                            <Typography>Videos of {name}</Typography>
                        </CardContent>
                    </ButtonBase>
                </Card>
                <Card>
                    <ButtonBase onClick={() => console.log('documents ref')}>
                        <CardMedia component='img' 
                            image='' 
                            alt='logo' />
                        <CardContent>
                            <Typography>Documents of {name}</Typography>
                        </CardContent>
                    </ButtonBase>
                </Card>
            </Box>
        </div>
    );
}

export default ProfilePage;