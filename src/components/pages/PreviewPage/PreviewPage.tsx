import { useCallback, useRef, useState } from 'react';
import { Button, CircularProgress, Modal, useTheme } from "@mui/material";
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import Webcam from 'react-webcam';
import axios, { AxiosResponse } from 'axios';
import { io } from 'socket.io-client';
// import { useParams } from 'react-router-dom';

import MarkedImage from '../../shared/MarkedImage/MarkedImage';
import classes from './PreviewPage.module.css';

const PreviewPage = (): JSX.Element => {
    // const params = useParams();
    const theme = useTheme();
    const webcamRef = useRef<Webcam>(null);
    
    const socket = io(process.env.REACT_APP_QURUE_CONSUMER_URL as string || 'http://10.0.0.12:30083');

    const [scannedImage, setScannedImage] = useState<string>();
    const [scanRes, setScanRes] = useState<any>(null);
    const [isWaiting, setIsWaiting] = useState<boolean>(false);

    const waitForCallback = (requestID: string): Promise<any> => {
        return new Promise( (resolve, reject) => {
            console.log('wating for: ', requestID);
            socket.on(requestID, (data: any) => {
                console.log('data arrived:', data);

                // Cancel the requestID
                socket.off(requestID);
                console.log(`Callback for ${requestID}, has been canaceled`);
                
                setScanRes(data);
                setIsWaiting(false);
                return resolve(data);
            });
        });
    }

    const toBlob = async (dataURI: string): Promise<Blob> => {
        const res = await fetch(dataURI);
        return await res.blob();
    }

    const sendBufferImage = async (bufferData: string): Promise<string> => {
        console.log('bufferData:', bufferData);
    
        const serviceURL: string = process.env.REACT_APP_FILE_VALIDATOR_URL || `http://10.0.0.12:30030`;
    
        const data: FormData = new FormData();
        data.append('files', await toBlob(bufferData));
        // dataToSend.append('indexPhoto', false);
    
        try {
            const res: AxiosResponse = await axios.post(`${serviceURL}/recognize-faces`, data, {
                headers: { 'Content-Type': `multipart/form-data` }
            });
    
            if (res.status === 200) {
                if (!res.data.filesCount) throw new Error('There is no files attached to the request');
    
                console.log('resBody:', res.data);
                waitForCallback(res.data?.requestID as string);
            }
    
            return '';
        } catch(ex) {
            throw ex;
        }
    }

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current!.getScreenshot();
        console.log('imgSrc', imageSrc);
        
        setScannedImage(imageSrc!);
        
        setIsWaiting(true);
        sendBufferImage(imageSrc!);
    }, [webcamRef]);

    const webcamContent = (): JSX.Element => {
        return (
            <>
                <Webcam ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg" />

                <Button className={classes['shutter-button']} 
                    variant="contained"
                    disabled={isWaiting}
                    onClick={capture}>
                    <CameraAltIcon />
                </Button>
            </>
        );
    }

    const loadingSpinner = (): JSX.Element => {
        return (
            <Modal className={classes['spinner-background']} open={isWaiting}>
                <CircularProgress />
            </Modal>
        );
    }
    
    return (
        <div className={classes['preview-page']}>
            { isWaiting && loadingSpinner() }
            { !scannedImage && webcamContent() }
            { 
                scannedImage && <MarkedImage image={scannedImage} 
                    // maxOriginalDimensions={true}
                    hoverColor={{
                        background: theme.palette.secondary.main,
                        border: theme.palette.primary.main,
                        opacity: '.5'
                    }}
                    onClick={(data) => console.log(data)}
                    markers={scanRes || {}} /> 
            }
        </div>
    );
}

export default PreviewPage;