import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { RegionDrawer } from "../RegionSidebar";
import { RegionMap } from "./RegionMap";

export const ArtilleryPage = () => {
    const [regions, setRegions] = useState<string[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Measurement state
    const [measurement, setMeasurement] = useState<{ distance: number; azimuth: number } | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch("/api/foxhole/getregions")
            .then(res => res.json())
            .then((data: string[]) => {
                setRegions(data);
                if (data.length > 0) setSelectedRegion(data[0]);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <Box sx={{ display: "flex", bgcolor: "#1b1b1b", height: "100vh" }}>
            <RegionDrawer
                regions={regions}
                selectedRegion={selectedRegion}
                onSelectRegion={setSelectedRegion}
                loading={loading}
                drawerWidth={200}
            />

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    position: "relative",
                }}
            >

                {/* Map */}
                {selectedRegion && (
                    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <RegionMap
                            region={selectedRegion}
                            onMeasure={(data) => setMeasurement(data)}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};
