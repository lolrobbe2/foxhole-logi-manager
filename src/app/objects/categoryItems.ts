// src/data/categoryItems.ts
export type Faction = 'none' | 'warden' | 'colonial'

export interface CategoryItem {
	name: string
	image: string // file name, e.g. "44-magnum.webp"
	faction: Faction
	category: string
}

// Original categories without the category field
const categoriesRaw: Record<string, Omit<CategoryItem, 'category'>[]> = {
	'Small Arms': [
		{ name: '.44', image: 'RevolverAmmoItemIcon.webp', faction: 'none' },
		{ name: 'Cometa T2-9', image: 'RevolverItemIcon.webp', faction: 'none' },
		{ name: 'The Hangman 757', image: 'RevolvingRifleWItemIcon.webp', faction: 'warden' },
		{ name: '7.62mm', image: 'RifleAmmoItemIcon.webp', faction: 'none' },
		{ name: 'Fuscina pi.I', image: 'RifleLightCItemIcon.webp', faction: 'colonial' },
		{ name: 'Argenti r.II Rifle', image: 'RifleCItemIcon.webp', faction: 'colonial' },
		{ name: 'Catena rt.IV Auto-Rifle', image: 'RifleAutomaticCIcon.webp', faction: 'colonial' },
		{ name: 'KRR2-790 Omen', image: 'RifleLongC.webp', faction: 'colonial' },
		{ name: 'KRR3-792 Auger', image: 'SniperRifleCItemIcon.webp', faction: 'colonial' },
		{ name: 'Volta r.I Repeater', image: 'RifleHeavyCItemIcon.webp', faction: 'colonial' },
		{ name: 'Clancy Cinder M3', image: 'RifleLongW.webp', faction: 'warden' },
		{ name: 'Blakerow 871', image: 'CarbineItemIcon.webp', faction: 'warden' },
		{ name: 'No.2 Loughcaster', image: 'RifleW.webp', faction: 'warden' },
		{ name: 'No.2B Hawthorne', image: 'RifleShortWIcon.webp', faction: 'warden' },
		{ name: 'Sampo Auto-Rifle 77', image: 'RifleAutomaticW.webp', faction: 'warden' },
		{ name: 'Clancy-Raca M4', image: 'SniperRifleItemIcon.webp', faction: 'warden' },
		{ name: '8mm', image: 'PistolAmmoItemIcon.webp', faction: 'none' },
		{ name: 'Ferro 879', image: 'PistolItemIcon.webp', faction: 'colonial' },
		{ name: 'Ahti Model 2 ', image: 'PistolWItemIcon.webp', faction: 'warden' },
		{ name: 'Cascadier 873 ', image: 'PistolLightWItemIcon.webp', faction: 'warden' },
		{ name: '9mm', image: 'SubMachineGunAmmoIcon.webp', faction: 'none' },
		{ name: '“Lionclaw” mc.VIII', image: 'SMGHeavyCItemIcon.webp', faction: 'colonial' },
		{ name: '“The Pitch Gun” mc.V ', image: 'SMGCItemIcon.webp', faction: 'colonial' },
		{ name: 'Fiddler Submachine Gun Model 868', image: 'SubMachineGunIcon.webp', faction: 'warden' },
		{ name: 'No.1 “The Liar” Submachine Gun', image: 'SMGHeavyWItemIcon.webp', faction: 'warden' },
		{ name: 'Buckshot', image: 'ShotgunAmmoItemIcon.webp', faction: 'none' },
		{ name: 'KRF1-750 Dragonfly', image: 'ShotgunCItemIcon.webp', faction: 'colonial' },
		{ name: 'No.4 The Pillory Scattergun', image: 'ShotgunWItemIcon.webp', faction: 'warden' },
		{ name: 'Green Ash Grenade', image: 'DeadlyGas01Icon.webp', faction: 'none' },
		{ name: 'Bomastone Grenade', image: 'GrenadeCItemIcon.webp', faction: 'colonial' },
		{ name: 'A3 Harpa Fragmentation Grenade', image: 'GrenadeItemIcon.webp', faction: 'warden' },
		{ name: 'Smoke Grenade', image: 'Smokegrenadeicon1.webp', faction: 'none' },
		{ name: '12.7mm', image: 'MachineGunAmmoIcon.webp', faction: 'none' },
		{ name: 'Catara mo.II', image: 'LightMachineGunIcon.webp', faction: 'colonial' },
		{ name: 'KRN886-127 Gast Machine Gun', image: 'MGCItemIcon.webp', faction: 'warden' },
		{ name: 'Malone MK.2', image: 'MGWItemIcon.webp', faction: 'warden' },
	],
	'Heavy Arms': [
		{ name: '', image: '', faction: 'none' },
		{ name: '', image: '', faction: 'none' },
		{ name: '', image: '', faction: 'none' },
		{ name: '', image: '', faction: 'none' },
	]
}

// Add the category to each item
const categories: Record<string, CategoryItem[]> = Object.fromEntries(
	Object.entries(categoriesRaw).map(([category, items]) => [
		category,
		items.map(item => ({ ...item, category }))
	])
)

// Add "All" category automatically
export const categoryItems: Record<string, CategoryItem[]> = {
	All: Object.values(categories).flat(),
	...categories
}
