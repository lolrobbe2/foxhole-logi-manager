const colors = {
	background: '#1b1b1b',
	sidebar: '#2a2a2a',
	accent: '#7a5c3c',
	highlight: '#4a5c4d',
	text: '#e0e0d1'
}

import React from 'react'

interface RoleButtonProps {
	role: string
	active: boolean
	description: string
	onClick: (active: boolean) => void
}

const RoleButton: React.FC<RoleButtonProps> = ({ role, active, description, onClick }) => {
	const handleClick = () => {
		onClick(active) // let parent handle re-render with new state
	}
	console.log(`role: ${role}, active: ${active}`)
	return (
		<button
			onClick={handleClick}
			title={description}
			style={{
				padding: '0.4rem 0.8rem',
				borderRadius: '0.5rem',
				border: `1px solid ${colors.accent}`,
				backgroundColor: active ? colors.accent : colors.sidebar,
				color: active ? colors.text : colors.highlight,
				fontWeight: active ? 'bold' : 'normal',
				fontSize: '0.9rem',
				cursor: 'pointer',
				transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease'
			}}
			onMouseEnter={(e) => {
				;(e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.highlight
				;(e.currentTarget as HTMLButtonElement).style.color = colors.text
			}}
			onMouseLeave={(e) => {
				;(e.currentTarget as HTMLButtonElement).style.backgroundColor = active ? colors.accent : colors.sidebar
				;(e.currentTarget as HTMLButtonElement).style.color = active ? colors.text : colors.highlight
			}}
		>
			{role}
		</button>
	)
}

export default RoleButton
