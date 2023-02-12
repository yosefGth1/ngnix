import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MarkedImage.module.css"

interface Point {
    top_left: { x: number, y: number }
    bottom_right: { x: number, y: number }
}

interface Markers {
    [k: string]: Point[]
}

interface ArrMarkers {
    top_left: { x: number, y: number }
    bottom_right: { x: number, y: number }
    refId: string
}

interface PropsMarkedImage {
    image: HTMLImageElement | File | string;
    markers?: Markers;
    height?: string;
    width?: string;
    maxOriginalDimensions?: boolean;
    maxZoom?: number,
    minZoom?: number,
    hoverColor?: { background?: string, opacity?: string, border?: string };
    onClick?: (refID: string) => void;
    onHover?: (refID: string) => void;
}

function objToArray(markersObj: Markers | undefined) {
    if (typeof markersObj == "undefined") return []
    const arr = []

    for (let key of Object.keys(markersObj)) {
        for (let o of markersObj[key]) {
            arr.push({ ...o, refId: key })
        }
    }
    return arr
}

async function convertToDataURL(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            resolve(reader.result);
        }, false);

        reader.readAsDataURL(file);
    });
}

export default function MarkedImage(props: PropsMarkedImage) {
    const [image, setImage] = useState<HTMLImageElement | undefined>();
    const [arrMarkers, setArrMarkers] = useState<ArrMarkers[]>([])
    const [hover, setHover] = useState<string | null>(null)

    const SCROLL_SENSITIVITY = 0.0005;
    const MAX_ZOOM = props.maxZoom && props.maxZoom > 0 ? props.maxZoom : 1;
    const MIN_ZOOM = props.minZoom && props.minZoom > 0 ? props.minZoom : 1;

    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    // const [oldZoom, setOldZoom] = useState(1);
    const [draggind, setDragging] = useState(false);
    const [mouseMove, setMouseMove] = useState(false)
    const [zoomXY, setZoomXY] = useState({ x: 0, y: 0 })

    const touch = useRef({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const observer = useRef<any>(null);

    const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

    const handleWheel = (event: any) => {
        const { deltaY } = event;
        if (!draggind) {
            // setOldZoom(zoom)
            setZoom((zoom) =>
                clamp(zoom + deltaY * SCROLL_SENSITIVITY * -1, MIN_ZOOM, MAX_ZOOM)
            );
            if (zoom < 1) {
                setOffset({ x: 0, y: 0 })
            }
        }
    }

    const handleMouseMove = (event: any) => {
        if (draggind) {
            setMouseMove(true)
            
            const { x, y } = touch.current;
            const { clientX, clientY } = event;
            const maxPx: number = 50
            const maxWidthImage: number = canvasRef.current ? canvasRef.current.width * zoom + ((canvasRef.current.width - canvasRef.current.width * zoom) / 2) : 0
            const maxHeightImage: number = canvasRef.current ? canvasRef.current.height * zoom + ((canvasRef.current.height - canvasRef.current.height * zoom) / 2) : 0
            
            setOffset({
                x: canvasRef.current ? Math.abs(offset.x + (x - clientX)) < (maxWidthImage - maxPx) ? (offset.x + (x - clientX)) : (offset.x + (x - clientX)) > 0 ? (maxWidthImage - maxPx) : (maxWidthImage - maxPx) * -1 : 0,
                y: canvasRef.current ? Math.abs(offset.y + (y - clientY)) < (maxHeightImage - maxPx) ? (offset.y + (y - clientY)) : (offset.y + (y - clientY)) > 0 ? (maxHeightImage - maxPx) : (maxHeightImage - maxPx) * -1 : 0
            });
            touch.current = { x: clientX, y: clientY };
        }
    };

    const handleMouseDown = (event: any) => {
        const { clientX, clientY } = event;
        touch.current = { x: clientX, y: clientY };
        setDragging(true);
        setTimeout(() => {
            setMouseMove(false)
        }, 500);
    };

    const handleMouseUp = () => setDragging(false);

    const draw = useCallback(() => {
        if (canvasRef.current) {
            const { width, height } = canvasRef.current;
            const context = canvasRef.current.getContext("2d");

            // Set canvas dimensions
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            if (context && image) {

                // Clear canvas and scale it
                context.translate(-offset.x, -offset.y);
                context.scale(zoom, zoom);
                context.clearRect(0, 0, width, height);

                // Make sure we're zooming to the center
                const x = (context.canvas.width / zoom - image.width) / 2;
                const y = (context.canvas.height / zoom - image.height) / 2;
                setZoomXY({ x: x + zoom, y: y + zoom })
                
                // Draw image
                context.drawImage(image, x, y);
            }
        }
    }, [image, offset.x, offset.y, zoom]);

    useEffect(() => {
        observer.current = new ResizeObserver((entries) => {
            entries.forEach(({ target }) => {
                if (image && canvasRef && canvasRef.current) {
                    const { width, height } = image;
                    // If width of the container is smaller than image, scale image down
                    if (target.clientWidth < width) {
                        // Calculate scale
                        const scale = target.clientWidth / width;

                        // Redraw image
                        canvasRef.current.width = width * scale;
                        canvasRef.current.height = height * scale;
                        const context = canvasRef.current.getContext("2d")
                        if (context) context.drawImage(image, 0, 0, width * scale, height * scale);
                    }
                }
            });
        });
    }, [image]);

    useEffect(() => {
        if (canvasRef.current && image && canvasRef.current) {
            image.onload = () => {
                if (canvasRef && canvasRef.current) {
                    // Get the image dimensions
                    const { width, height } = image;
                    canvasRef.current.width = width;
                    canvasRef.current.height = height;

                    // Set image as image
                    const context = canvasRef.current.getContext("2d")
                    if (context) context.drawImage(image, 0, 0);
                }
            };
        }
    }, [image]);

    useEffect(() => {
        draw();
        // console.log('zoom:', zoom, ' zoomXY:', zoomXY, ' offset:', offset);
        // if (image) console.log(image.width * zoom);

    }, [draw, zoom, offset]);

    useEffect(() => {
        if (typeof props.image === 'string') {
            const tmpImg: HTMLImageElement = new Image();
            tmpImg.src = props.image
            setImage(tmpImg)
        } else if (props.image instanceof File) {
            const tmpImg: HTMLImageElement = new Image();

            convertToDataURL(props.image)
                .then((dataURL) => {
                    if (typeof dataURL == 'string')
                        tmpImg.src = dataURL
                });
            setImage(tmpImg);
        } else if (props.image instanceof HTMLImageElement) {
            setImage(props.image);
        } else {
            throw new Error('Unauthorized type')
        }
    }, [props.image]);

    useEffect(() => {
        draw();
    }, [draw, zoom]);

    useEffect(() => {
        setArrMarkers(objToArray(props.markers))
    }, [props.markers])

    !props.image && console.error('props.image is not provided');
    return (
        <>
            {
                image ?
                    <div ref={containerRef}>
                        <div className={styles.div} style={
                            {
                                width: props.width ? props.width : props.maxOriginalDimensions ? image.width : "100vw",
                                height: props.height ? props.height : props.maxOriginalDimensions ? image.height : "100vh",
                                maxWidth: "100vw",
                                maxHeight: "100vh",
                                overflow: `hidden`
                            }
                        }>
                            <canvas
                                className={styles.canvas}
                                style={{
                                    width: props.width ? props.width : props.maxOriginalDimensions ? image.width : "100vw",
                                    height: props.height ? props.height : props.maxOriginalDimensions ? image.height : "100vh",
                                    maxWidth: "100vw",
                                    maxHeight: "100vh"
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onWheel={handleWheel}
                                onMouseMove={handleMouseMove}
                                ref={canvasRef}>
                            </canvas>
                            {arrMarkers.map(m =>
                                <div
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}
                                    onWheel={handleWheel}
                                    onMouseMove={handleMouseMove}
                                    key={m.refId + m.top_left.x + m.top_left.y + m.bottom_right.x + m.bottom_right.y} className={styles.square} style={
                                        {
                                            width: `${Math.abs((m.top_left.x - m.bottom_right.x)) * 100 / image.width * zoom}%`,
                                            height: `${(Math.abs(m.top_left.y - m.bottom_right.y)) * 100 / image.height * zoom}%`,
                                            // maxWidth: `${canvasRef.current?.width}px`,
                                            // maxHeight: `${100}%`,
                                            top: `${((m.top_left.y + zoomXY.y - (offset.y / zoom)) * 100 / image.height * zoom)}%`,
                                            left: `${(m.top_left.x + zoomXY.x - (offset.x / zoom)) * 100 / image.width * zoom}%`,
                                            right: `${(m.bottom_right.x + offset.x) * 100 / image.width * zoom}%`,
                                            bottom: `${((m.bottom_right.y - zoomXY.y + (offset.y / zoom)) * 100 / image.height * zoom)}%`,
                                            background: hover === m.refId + m.top_left.x + m.top_left.y + m.bottom_right.x + m.bottom_right.y && props.hoverColor ? props.hoverColor.background : "",
                                            opacity: hover === m.refId + m.top_left.x + m.top_left.y + m.bottom_right.x + m.bottom_right.y && props.hoverColor ? props.hoverColor.opacity : "",
                                            border: hover === m.refId + m.top_left.x + m.top_left.y + m.bottom_right.x + m.bottom_right.y && props.hoverColor ? props.hoverColor.border : ""
                                        }
                                    }
                                    onClick={() => {
                                        if (props.onClick && !draggind && !mouseMove) props.onClick(m.refId);
                                    }}
                                    onMouseEnter={() => {
                                        props.onHover && props.onHover(m.refId);
                                        setHover(m.refId + m.top_left.x + m.top_left.y + m.bottom_right.x + m.bottom_right.y)
                                    }}
                                    onMouseLeave={() => {
                                        setHover(null)
                                    }}
                                ></div>
                            )}
                        </div>
                    </div>
                    :
                    <div>
                        <span>Image not provided</span>
                    </div>
            }
        </>
    );
}