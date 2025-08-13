import React, { FC, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Item } from './StockpileItem';
import { StockpileItem } from '../../../app/objects/Stockpile';
import { CategoryItem } from './CategoriesSelector';

interface CategoryItemsGridProps {
    category: string;
    /** list of item types to render for this category */
    itemTypes: CategoryItem[];
    /** array of stockpile items */
    stockpileItems?: StockpileItem[] | null;
    /** base path for images, defaults to /stockpile */
    imageBasePath?: string;
    /** optional heading above the grid */
    title?: string;
}

/** Normalize an item key for fuzzy matching */
function normalizeKey(k: string): string {
    return k.toLowerCase().replace(/[\s'’-]/g, '');
}

/** Find count from an array of StockpileItem */
function resolveCount(itemName: string, stockpileItems?: StockpileItem[] | null): number | null {
    if (!stockpileItems) return null;

    // Try direct match
    const directMatch = stockpileItems.find((item) => item.name === itemName);
    if (directMatch) return directMatch.count ?? null;

    // Try normalized match
    const target = normalizeKey(itemName);
    const normalizedMatch = stockpileItems.find((item) => normalizeKey(item.name) === target);
    return normalizedMatch ? normalizedMatch.count ?? null : null;
}

export const CategoryItemsGrid: FC<CategoryItemsGridProps> = ({
    category,
    itemTypes,
    stockpileItems,
    imageBasePath = '/stockpile',
    title
}) => {
    const itemsWithCounts = useMemo(
        () =>
            itemTypes.map((item) => ({
                item,
                count: resolveCount(item.name, stockpileItems)
            })),
        [itemTypes, stockpileItems]
    );

    return (
        <Box sx={{ width: '100%' }}>
            {title && (
                <Typography
                    variant="h6"
                    sx={{
                        mb: '0.75rem',
                        color: '#e0e0d1',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}
                >
                    {title}
                </Typography>
            )}

            <Box
                component="section"
                aria-label={`${category} items`}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(6rem, 1fr))',
                    gap: '1rem',
                    alignItems: 'start'
                }}
            >
                {itemsWithCounts.map((it) => (
                    <Item
                        key={it.item.name}
                        name={it.item.name}
                        category={category}
                        count={it.count ?? null}
                        image={it.item.image}
                        faction={it.item.faction || 'none'}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default CategoryItemsGrid;
