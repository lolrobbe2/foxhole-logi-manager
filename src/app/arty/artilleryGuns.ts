export interface ArtilleryGun {
    name: string;
    dispersion: number; // meters or your chosen unit
    windDeviation: number; // meters deviation at max range
    faction: "Wardens" | "Colonials" | "Neutral";
    maxdistance: number; // meters
    mindistance: number; // meters
}

export const artilleryGuns: ArtilleryGun[] = [
    {
        name: "120-68 “Koronides” Field Gun",
        dispersion: 30,
        windDeviation: 5,
        faction: "Colonials",
        maxdistance: 250,
        mindistance: 100
    },
    {
        name: "50-500 “Thunderbolt” Cannon",
        dispersion: 40,
        windDeviation: 8,
        faction: "Colonials",
        maxdistance: 350,
        mindistance: 200
    },
    {
        name: "Mortar",
        dispersion: 2,
        windDeviation: 1,
        faction: "Neutral",
        maxdistance: 500,
        mindistance: 50
    }
];
