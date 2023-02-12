import { useCallback } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card } from '@mui/material';

import SideBar from '../../shared/SideBar/SideBar';
import SearchBar from '../../shared/SearchBar/SearchBar';
import LogoNoch from '../../shared/LogoNoch/LogoNoch';

import classes from './HomePage.module.css';


const HomePage = (): JSX.Element => {
    const navigate: NavigateFunction = useNavigate();
    // const { getRootProps, getInputProps } = useDropzone();
    
    const onDrop = useCallback((acceptedFiles: any) => {
        // Do something with the files
        console.log(acceptedFiles);
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop, noClick: true });

    const showDropzone = (): JSX.Element => {
        return isDragActive ? (
            <Card elevation={10} 
                sx={{ 
                    zIndex: '2000',
                    position: 'fixed',
                    margin: '0 auto',
                    width: 600, 
                    height: 300, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                }}>
                <input className="input-zone" {...getInputProps()} />
                <p>Drop files here!</p>
            </Card>
        ) : <></>;
    }

    return (
        <div className={classes["home-page"]} {...getRootProps()}>
            <header className={classes.header}>
                <LogoNoch />
                <SideBar />
            </header>
            <main className={classes['main-content']}>
                { showDropzone() }
                <SearchBar onCameraClicked={() => navigate('preview')} />
                <br/>
                <p>
                    <strong>About face recognition:</strong> <br/>
                    Here you can find photos, documents, and archive clip that indicate a certain person's face. <br/> 
                    To search type a name or use a picture to find faces from.
                </p>
            </main>
        </div>
    );
}

export default HomePage;