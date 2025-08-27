const colors = {
	background: '#1b1b1b',
	sidebar: '#2a2a2a',
	accent: '#7a5c3c',
	highlight: '#4a5c4d',
	text: '#e0e0d1'
}

import React, { useState } from 'react'
import {
	Box,
	Typography,
	Paper,
	List,
	ListItem,
	ListItemText,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText
} from '@mui/material'

interface RoleGroupProps {
	role: string
	description?: string
	users: string[]
}

const RoleGroup: React.FC<RoleGroupProps> = ({ role, description, users }) => {
	const [open, setOpen] = useState(false)

	const handleOpen = () => {
		if (description) setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<>
			<Paper
				elevation={3}
				sx={{
					padding: 2,
					width: 280,
					bgcolor: colors.sidebar,
					color: colors.text
				}}
			>
				<Typography
					variant="h6"
					gutterBottom
					sx={{
						cursor: description ? 'pointer' : 'default',
						color: colors.accent
					}}
					onClick={handleOpen}
				>
					{role}
				</Typography>

				{users.length === 0 ? (
					<Typography variant="body2" sx={{ color: colors.highlight }}>
						No users assigned
					</Typography>
				) : (
					<List dense>
						{users.map((user) => (
							<ListItem
								key={user}
								sx={{
									bgcolor: colors.background,
									mb: 1,
									borderRadius: 1,
									color: colors.text
								}}
							>
								<ListItemText primary={user} />
							</ListItem>
						))}
					</List>
				)}
			</Paper>

			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: { bgcolor: colors.background, color: colors.text }
				}}
			>
				<DialogTitle sx={{ color: colors.accent }}>{role}</DialogTitle>
				<DialogContent>
					<DialogContentText sx={{ color: colors.text }}>{description}</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default RoleGroup
