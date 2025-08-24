import { Box, Typography } from '@mui/material';
import { FC, useMemo } from 'react';
import { StockpileItem } from '../../../app/objects/Stockpile';
import { CategoryItem } from '../../../app/objects/categoryItems';
import { Item } from './StockpileItem';

interface CategoryItemsGridProps {
    category: string;
    itemTypes: CategoryItem[];
    stockpileItems?: StockpileItem[] | null;
    imageBasePath?: string;
    title?: string;
    onItemClick?: (item: CategoryItem, count: number | null) => void;
}

function normalizeKey(k: string): string {
    return k.toLowerCase().replace(/[\s'’-]/g, '');
}

function resolveCount(itemName: string, stockpileItems?: StockpileItem[] | null): number | null {
    if (!stockpileItems) return null;

    const directMatch = stockpileItems.find((item) => item.name === itemName);
    if (directMatch) return directMatch.count ?? null;

    const target = normalizeKey(itemName);
    const normalizedMatch = stockpileItems.find((item) => normalizeKey(item.name) === target);
    return normalizedMatch ? normalizedMatch.count ?? null : null;
}

export const CategoryItemsGrid: FC<CategoryItemsGridProps> = ({
    category,
    itemTypes,
    stockpileItems,
    imageBasePath = '/stockpile',
    title,
    onItemClick
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
                {itemsWithCounts.map((it, idx) => (
                    <Item
                        key={`${idx}-${it.item.name}`}
                        name={it.item.name}
                        category={it.item.category}
                        count={it.count ?? null}
                        image={it.item.image}
                        faction={it.item.faction || 'none'}
                        onClick={() => onItemClick?.(it.item, it.count ?? null)}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default CategoryItemsGrid;
