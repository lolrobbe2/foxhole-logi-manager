import React, { useEffect, useState } from 'react'
import DiscordService from '../discord'
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Container } from '@mui/material'
import UserRoleRow from './UserRoleRow'
import RoleGroup from './RoleGroups'

const STATIC_ROLES: { name: string; description: string }[] = [
	{
		name: 'Infantry Division',
		description:
			'The frontline warriors of VOID. Infantry fight side by side with their regiment brothers and sisters, holding ground, pushing enemy lines, and securing victory for the Colonials.'
	},

	{
		name: 'Front Line Engineer',
		description:
			'VOID’s combat engineers build and repair fortifications under fire, keeping our positions strong and our infantry protected as we push the front.'
	},

	{
		name: 'Forward Operating Base Team',
		description:
			'VOID teams who establish and supply FOBs close to the action, ensuring our regiment always has spawn points and a forward presence.'
	},

	{
		name: 'Front Line Logistics',
		description:
			'VOID haulers who brave enemy fire to deliver vital ammo, weapons, and supplies directly to the battlefield — the lifeline of our front.'
	},

	{
		name: 'Back Line Logistics',
		description:
			'The backbone of VOID. These teams run the long hauls, moving fuel, components, and supplies from the rear lines to feed the entire Colonial war machine.'
	},

	{
		name: 'Armoured Division',
		description:
			'VOID’s tank crews bring heavy firepower to the battlefield, spearheading assaults and smashing enemy defences with precision and teamwork.'
	},

	{
		name: 'Mechanised Infantry (Light Armour)',
		description:
			'Fast-moving VOID infantry supported by half-tracks and armoured cars, striking quickly and holding ground with mobility and fire support.'
	},

	{
		name: 'Recon Division (Partisan)',
		description:
			'VOID scouts and partisans who strike behind enemy lines, harassing supply chains, gathering intel, and spreading chaos deep in enemy territory.'
	},

	{
		name: 'Artillery Division',
		description:
			'VOID’s artillery crews deliver devastating long-range bombardments, softening enemy positions and paving the way for our assaults.'
	},

	{
		name: 'Naval Division',
		description:
			'Sailors of VOID who crew Colonial warships, dominate the waterways, and provide heavy coastal fire support to our ground forces.'
	},

	{
		name: 'Base Builder Team',
		description:
			'VOID builders design and construct the fortresses and strongholds that keep the Colonials safe, ensuring our regiment always has strongholds to fight from.'
	},

	{
		name: 'Base Maintenance',
		description:
			'VOID engineers who repair, upgrade, and resupply our bases, keeping every structure battle-ready and able to withstand enemy assaults.'
	},

	{
		name: 'Medical Division',
		description:
			'The lifesavers of VOID. Medics risk everything to revive fallen Colonials, keeping morale high and our regiment fighting longer on the front.'
	}
]

const RoleSelection: React.FC = () => {
	const [rolesByUser, setRolesByUser] = useState<Record<string, string[]>>({})
	const [loading, setLoading] = useState(true)

	// Mock current user for now
	const currentUsername = DiscordService.getUserName() || 'You'

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const guildId = DiscordService.getGuildId()
				if (!guildId || guildId === 'null') throw new Error('Guild ID not available')

				const roles = await DiscordService.getAllUserRoles(guildId)
				setRolesByUser(roles)
			} catch {
				setRolesByUser({})
			} finally {
				setLoading(false)
			}
		}

		fetchRoles()
	}, [])

	// Group users by role
	const roleGroups: Record<string, string[]> = {}
	Object.entries(rolesByUser).forEach(([user, roles]) => {
		roles.forEach((role) => {
			if (!roleGroups[role]) roleGroups[role] = []
			roleGroups[role].push(user)
		})
	})

	const currentUserRoles = rolesByUser[currentUsername] || []

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Typography variant="h4" gutterBottom>
				Role Selection
			</Typography>

			{loading ? (
				<Box display="flex" justifyContent="center" alignItems="center" height="50vh">
					<CircularProgress />
				</Box>
			) : (
				<>
					{/* 👤 Personal Role Selection */}
					<Box sx={{ mb: 4 }}>
						<UserRoleRow username={currentUsername} userRoles={currentUserRoles} staticRoles={STATIC_ROLES} />
					</Box>

					{/* 🧑‍🤝‍🧑 Role Groups Overview */}
					<Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
						{STATIC_ROLES.map(({ name, description }) => (
							<RoleGroup key={name} role={name} description={description} users={roleGroups[name] || []} />
						))}
					</Box>
				</>
			)}
		</Container>
	)
}

export default RoleSelection
