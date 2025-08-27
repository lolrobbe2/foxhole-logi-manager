import React, { useState } from 'react'
import RoleButton from './RoleButton'
import DiscordService from '../discord'

type Role = { id: string; name: string }

interface UserRoleRowProps {
	username: string
	userRoles: Role[]
	staticRoles: { name: string; description: string }[]
}

const UserRoleRow: React.FC<UserRoleRowProps> = ({ username, userRoles, staticRoles }) => {
	const [roles, setRoles] = useState<Role[]>(userRoles)

	const handleRoleToggle = async (roleName: string, active: boolean) => {
		setRoles(
			(prevRoles) =>
				active
					? prevRoles.filter((r) => r.name !== roleName) // remove
					: [...prevRoles, { id: roleName, name: roleName }] // add
		)

		// Fire the API call in the background
		try {
			const result = await DiscordService.updateRole(roleName, active ? 'remove' : 'add')
			if (!result.success) {
				console.log('Failed to update role:', result.error)
			}

			// Always refresh local state from server after API response
			const updatedRoles: Role[] = await DiscordService.getUserRoles()
			setRoles(updatedRoles)
		} catch (err: any) {
			console.log('Error updating role:', err?.message || err)
			// Refresh from server on error
			const updatedRoles: Role[] = await DiscordService.getUserRoles()
			setRoles(updatedRoles)
		}
	}

	return (
		<li
			style={{
				marginBottom: '1.5rem',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				textAlign: 'center'
			}}
		>
			<strong>{username}</strong>
			<div
				style={{
					display: 'flex',
					gap: '0.5rem',
					marginTop: '0.5rem',
					flexWrap: 'wrap',
					justifyContent: 'center'
				}}
			>
				{staticRoles.map(({ name, description }) => {
					const isActive = roles.some((r) => r.name === name)

					return (
						<RoleButton
							key={name}
							role={name}
							active={isActive}
							description={description}
							onClick={(active) => handleRoleToggle(name, active)}
						/>
					)
				})}
			</div>
		</li>
	)
}

export default UserRoleRow
