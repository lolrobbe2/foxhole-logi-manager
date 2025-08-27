import React, { useState } from 'react'
import RoleButton from './RoleButton'
import DiscordService from '../discord'

interface UserRoleRowProps {
	username: string
	userRoles: string[]
	staticRoles: { name: string; description: string }[]
}

const UserRoleRow: React.FC<UserRoleRowProps> = ({ username, userRoles, staticRoles }) => {
	const [roles, setRoles] = useState<string[]>(userRoles)

	const handleRoleToggle = (role: string, active: boolean) => {
        //DiscordService.updateRole()
		setRoles((prevRoles) => (active ? [...prevRoles, role] : prevRoles.filter((r) => r !== role)))
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
				{staticRoles.map(({ name, description }) => (
					<RoleButton
						key={name}
						role={name}
						active={roles.includes(name)}
						description={description}
						onClick={(active) => handleRoleToggle(name, active)}
					/>
				))}
			</div>
		</li>
	)
}

export default UserRoleRow
