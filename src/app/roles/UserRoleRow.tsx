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

	const handleRoleToggle = (roleName: string, active: boolean) => {
		// Fire-and-forget API call
		DiscordService.updateRole(roleName, active ? 'add' : 'remove')
			.then((result) => {
				if (!result.success) {
					console.log('Failed to update role:', result.error)
				}
			})
			.catch((err) => console.log('Error updating role:', err))

		// Update local state immediately
		setRoles((prevRoles) =>
			active ? [...prevRoles, { id: roleName, name: roleName }] : prevRoles.filter((r) => r.name !== roleName)
		)
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
