export interface ArtilleryGun {
	name: string
	dispersion: [number, number] // meters or your chosen unit
	windDeviation: number[] // meters deviation at max range
	faction: 'Wardens' | 'Colonials' | 'Neutral'
	maxdistance: number // meters
	mindistance: number // meters
}

export const artilleryGuns: ArtilleryGun[] = [
	{
		name: '120-68 “Koronides” Field Gun',
		dispersion: [35.0, 50.0],
		windDeviation: [12.5, 15.0, 20.0, 35.0, 45.0],
		faction: 'Colonials',
		maxdistance: 250,
		mindistance: 100
	},
	{
		name: '50-500 “Thunderbolt” Cannon',
		dispersion: [30,40],
		windDeviation: 10,
		faction: 'Colonials',
		maxdistance: 350,
		mindistance: 200
	},
	{
		name: 'Mortar',
		dispersion: [30,40],
		windDeviation: 1,
		faction: 'Neutral',
		maxdistance: 500,
		mindistance: 50
	}
]
