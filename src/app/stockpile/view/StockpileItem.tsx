import { Box, Typography, Tooltip } from '@mui/material';
import { FC } from 'react';

interface ItemProps {
	name: string;
	category: string;
	count?: number | null;
}

export const Item: FC<ItemProps> = ({ name, category, count }) => {
	const imageSrc = `/stockpile/${category}/${name}.webp`;
	const isAvailable = count != null && count > 0;

	return (
		<Tooltip title={name} arrow>
			<Box
				sx={{
					width: '5rem',
					height: '5rem',
					position: 'relative',
					bgcolor: '#2a2a2a',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					border: '1px solid #3a3a3a',
					borderRadius: '0.25rem',
					cursor: 'pointer',
				}}
			>
				<img
					src={imageSrc}
					alt={name}
					style={{
						width: '80%',
						height: '80%',
						objectFit: 'contain',
						filter: isAvailable ? 'none' : 'grayscale(100%) brightness(0.5)',
					}}
				/>
				{isAvailable && (
					<Typography
						variant="body2"
						sx={{
							position: 'absolute',
							bottom: '0.2rem',
							right: '0.3rem',
							color: '#fff',
							fontWeight: 'bold',
							textShadow: '0px 0px 3px rgba(0,0,0,0.8)',
						}}
					>
						{count}
					</Typography>
				)}
			</Box>
		</Tooltip>
	);
};
