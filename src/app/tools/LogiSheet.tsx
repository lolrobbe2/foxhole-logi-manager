import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const LOGI_SHEET_URL_URL =
    process.env.NODE_ENV === "production"
        ? "/logisheet/FoxholeLogiSheet/facility"
        : "https://defiesm1.github.io/FoxholeLogiSheet/facility";

export const LogiSheet = () => {
    const [loading, setLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const handleLoad = () => setLoading(false);
        iframe.addEventListener("load", handleLoad);

        return () => {
            iframe.removeEventListener("load", handleLoad);
        };
    }, []);

    return (
        <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
            {loading && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#1b1b1b"
                    }}
                >
                    <CircularProgress color="inherit" />
                </Box>
            )}

            <iframe
                ref={iframeRef}
                src={LOGI_SHEET_URL_URL}
                title="LOGI_SHEET_URL GPS"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none"
                }}
            />
        </Box>
    );
};
