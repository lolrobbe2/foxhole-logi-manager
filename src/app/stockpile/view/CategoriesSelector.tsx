import { Box, IconButton, Tooltip } from '@mui/material';
import { FC, useEffect, useState } from 'react';

export interface CategorySelectorItem {
    name: string
    image: string // file name, e.g. "44-magnum.webp"
}

interface CategoriesSelectorProps {
	categories: CategorySelectorItem[];
	onCategoryClick?: (category: CategorySelectorItem) => void;
	selectedCategory?: string;
}

export const CategoriesSelector: FC<CategoriesSelectorProps> = ({
	categories,
	onCategoryClick,
	selectedCategory
}) => {
	const [current, setCurrent] = useState<string>('');

	// Foxhole orange shade filter
	const orangeFilter =
		'invert(50%) sepia(92%) saturate(500%) hue-rotate(340deg) brightness(95%) contrast(95%)';

	// Default to first category if none selected
	useEffect(() => {
		if (selectedCategory) {
			setCurrent(selectedCategory);
		} else if (categories.length > 0) {
			setCurrent(categories[0].name);
		}
	}, [categories, selectedCategory]);

	return (
		<Box
			sx={{
				bgcolor: '#2a2a2a',
				display: 'flex',
				gap: '0.5rem',
				overflowX: 'auto',
				py: '0.25rem',
				px: '0.5rem',
				borderBottom: '2px solid #7a5c3c',
				scrollbarWidth: 'none',
				'&::-webkit-scrollbar': { display: 'none' }
			}}
		>
			{categories.map((cat, idx) => {
				const isSelected = cat.name === current;
				return (
					<Tooltip key={idx} title={cat.name} arrow>
						<IconButton
							disableRipple
							disableFocusRipple
							disableTouchRipple
							onClick={() => {
								setCurrent(cat.name);
								onCategoryClick?.(cat);
							}}
							sx={{
								width: '2.25rem',
								height: '2.25rem',
								borderRadius: '0.25rem',
								p: 0,
								background: 'transparent',
								outline: 'none',
								'&:hover': {
									background: 'transparent'
								},
								'&:focus': {
									outline: 'none'
								}
							}}
						>
							<img
								src={cat.image}
								alt={cat.name}
								style={{
									width: '2rem',
									height: '2rem',
									objectFit: 'contain',
									filter: isSelected
										? orangeFilter
										: 'brightness(0) invert(1)',
									transition: 'filter 0.15s ease'
								}}
							/>
						</IconButton>
					</Tooltip>
				);
			})}
		</Box>
	);
};

export { CategorySelectorItem };
