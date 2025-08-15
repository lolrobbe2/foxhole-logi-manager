import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { RegionDrawer } from "../RegionSidebar";
import { GunDrawer } from "./GunDrawer";
import { RegionMap } from "./RegionMap";
import { WindDrawer } from "./WindDrawer";
import { ArtilleryGun } from "./artilleryGuns";

export const ArtilleryPage = () => {
    const [regions, setRegions] = useState<string[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedGun, setSelectedGun] = useState<ArtilleryGun | null>(null);
    const [selectedWind, setSelectedWind] = useState<number | null>(null);

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
            {/* Left side region drawer */}
            <RegionDrawer
                regions={regions}
                selectedRegion={selectedRegion}
                onSelectRegion={setSelectedRegion}
                loading={loading}
                drawerWidth={200}
            />

            {/* Center map */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    position: "relative",
                }}
            >
                {selectedRegion && (
                    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <RegionMap
                            region={selectedRegion}
                            onMeasure={(data) => setMeasurement(data)}
                            selectedGun={selectedGun}
                            level={selectedWind}
                        />
                    </Box>
                )}
            </Box>

            {/* Right side stacked drawers */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <GunDrawer selectedGun={selectedGun} onSelectGun={setSelectedGun} />
                <WindDrawer selectedWind={selectedWind} onSelectWind={setSelectedWind} />
            </Box>
        </Box>
    );
};
