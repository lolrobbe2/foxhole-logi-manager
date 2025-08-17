import Box from "@mui/material/Box";

export const GPS = () => {
    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <iframe
                src="/logiwaze"
                title="Logiwaze GPS"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none"
                }}
            />
        </Box>
    );
};
