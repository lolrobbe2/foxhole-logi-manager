import { Box } from "@mui/material";
import { MouseEvent, useEffect, useRef, useState } from "react";

interface Point {
    x: number; // pixel coordinates
    y: number;
}

interface RegionMapProps {
    region: string;
    onMeasure?: (data: { distance: number; azimuth: number }) => void;
}

export const RegionMap = ({ region, onMeasure }: RegionMapProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const draggingRef = useRef<{ x: number; y: number } | null>(null);
    const [measurement, setMeasurement] = useState<{ distance: number; azimuth: number } | null>(null);
    const [pixelToMeter, setPixelToMeter] = useState<number>(0.93622857142);

    // Update PIXEL_TO_METER based on rendered image width
    useEffect(() => {
        const img = imageRef.current;
        if (img) {
            const rect = img.getBoundingClientRect();
            setPixelToMeter(rect.width / 2187.5);
        }
    }, [region]);

    // Calculate distance and azimuth whenever points or pixelToMeter change
    useEffect(() => {
        if (points.length === 2 && pixelToMeter > 0) {
            const { distance, azimuth } = calculateDistanceAndAzimuth(points[0], points[1], pixelToMeter);
            setMeasurement({ distance, azimuth });
            if (onMeasure) onMeasure({ distance, azimuth });
        } else {
            setMeasurement(null);
        }
    }, [points, onMeasure, pixelToMeter]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1) { // middle mouse button
            draggingRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
            e.preventDefault();
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingRef.current) {
            const container = containerRef.current;
            const img = imageRef.current;
            if (!container || !img) return;
            const containerRect = container.getBoundingClientRect();
            const imgRect = img.getBoundingClientRect();

            let newX = e.clientX - draggingRef.current.x;
            let newY = e.clientY - draggingRef.current.y;

            // Clamp so image does not leave container
            newX = Math.min(0, Math.max(containerRect.width - imgRect.width, newX));
            newY = Math.min(0, Math.max(containerRect.height - imgRect.height, newY));

            setOffset({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        draggingRef.current = null;
    };

    const handleClick = (e: MouseEvent<HTMLImageElement>) => {
        const container = containerRef.current;
        const img = imageRef.current;
        if (!container || !img) return;
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left - offset.x;
        const clickY = e.clientY - rect.top - offset.y;

        setPoints(prev => {
            if (prev.length >= 2) return [{ x: clickX, y: clickY }];
            return [...prev, { x: clickX, y: clickY }];
        });
    };

    return (
        <Box
            ref={containerRef}
            sx={{
                width: "100%",
                height: "100vh",
                position: "relative",
                overflow: "hidden",
                cursor: draggingRef.current ? "grabbing" : "default"
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* Measurement Banner */}
            {measurement && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "1rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: "rgba(0,0,0,0.7)",
                        color: "white",
                        px: 2,
                        py: 1,
                        borderRadius: "0.5rem",
                        fontSize: "1rem",
                        zIndex: 10,
                    }}
                >
                    Distance: {measurement.distance.toFixed(1)} m | Azimuth: {measurement.azimuth.toFixed(1)}°
                </Box>
            )}

            {/* Map Image */}
            <Box
                sx={{
                    display: "inline-block",
                    border: "0.25rem solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.2)",
                    overflow: "hidden",
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                    cursor: "grab",
                }}
            >
                <Box
                    component="img"
                    ref={imageRef}
                    src={`/Map/Map${region}.webp`}
                    alt={region}
                    onClick={handleClick}
                    sx={{
                        height: "95vh",
                        display: "block",
                        userSelect: "none",
                        cursor: "crosshair",
                    }}
                />
            </Box>

            {/* Points */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                }}
            >
                {points.map((p, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: "absolute",
                            left: `${p.x}px`,
                            top: `${p.y}px`,
                            width: "10px",
                            height: "10px",
                            bgcolor: i === 0 ? "red" : "blue",
                            borderRadius: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                ))}
            </Box>

            {/* Line */}
            {points.length === 2 && (
                <svg
                    width="100%"
                    height="100%"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        pointerEvents: "none",
                        transform: `translate(${offset.x}px, ${offset.y}px)`,
                    }}
                >
                    <line
                        x1={points[0].x}
                        y1={points[0].y}
                        x2={points[1].x}
                        y2={points[1].y}
                        stroke="yellow"
                        strokeWidth={2}
                    />
                </svg>
            )}
        </Box>
    );
};

// Utility: distance in meters, azimuth in degrees (north = 0°)
function calculateDistanceAndAzimuth(p1: Point, p2: Point, pixelToMeter: number) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    const distance = Math.sqrt(dx * dx + dy * dy) / pixelToMeter;
    const azimuth = (Math.atan2(dx, -dy) * 180) / Math.PI;
    const normalizedAzimuth = (azimuth + 360) % 360;

    return { distance, azimuth: normalizedAzimuth };
}
