import { Box } from "@mui/material";
import { useState } from "react";

const compassPoints: { label: string; angle: number }[] = [
    { label: "N", angle: 0 },
    { label: "NE", angle: 315 },
    { label: "E", angle: 270 },
    { label: "SE", angle: 225 },
    { label: "S", angle: 180 },
    { label: "SW", angle: 135 },
    { label: "W", angle: 90 },
    { label: "NW", angle: 45 },
];

interface WindDialProps {
    onChange?: (direction: number) => void; // 0–359°
    size?: number; // in rem
    leftOffset?: number; // in rem
    bottomOffset?: number; // in rem
}

export const WindDial = ({
    onChange,
    size = 8,
    leftOffset = 3,
    bottomOffset = 3,
}: WindDialProps) => {
    const [direction, setDirection] = useState<number>(0);

    const handleClick = (angle: number) => {
        setDirection(angle);
        if (onChange) onChange(angle);
    };

    return (
        <Box
            sx={{
                position: "absolute",
                bottom: `${bottomOffset}rem`,
                left: `${leftOffset}rem`,
                width: `${size}rem`,
                height: `${size}rem`,
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
            }}
        >
            {compassPoints.map((point) => {
                const rad = (point.angle - 90) * (Math.PI / 180);
                const r = size * 0.35;
                const x = r * Math.cos(rad);
                const y = r * Math.sin(rad);

                return (
                    <Box
                        key={point.label}
                        onClick={() => handleClick(point.angle)}
                        sx={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: `translate(${x}rem, ${y}rem) translate(-50%, -50%)`,
                            width: "2rem",
                            height: "2rem",
                            borderRadius: "50%",
                            bgcolor: direction === point.angle ? "lime" : "white",
                            color: "black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                            cursor: "pointer",
                            userSelect: "none",
                            border: "0.125rem solid #222",
                        }}
                    >
                        {point.label}
                    </Box>
                );
            })}

            {/* Arrow */}
            <Box
                sx={{
                    position: "absolute",
                    left: "50%",
                    width: "0.25rem",
                    height: `${size * 0.3}rem`,
                    bgcolor: "lime",
                    transformOrigin: "bottom center",
                    transform: `translate(-50%, -50%) rotate(${direction}deg)`,
                    borderRadius: "0.125rem",
                }}
            />

        </Box>
    );
};
