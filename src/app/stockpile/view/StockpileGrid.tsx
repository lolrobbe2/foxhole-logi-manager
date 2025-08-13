// CategoryItemsGrid.tsx
import React, { FC, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Item } from './StockpileItem'; // <- path to your Item component
// reuse the StockpileItem type you defined earlier
export type StockpileItemMap = { [itemName: string]: number };

interface CategoryItemsGridProps {
  category: string;
  /** list of item names (without extension) to render for this category */
  itemNames: string[];
  /** optional map of itemName => count from the stockpile */
  stockpileItems?: StockpileItemMap | null;
  /** base path for images, defaults to /stockpile */
  imageBasePath?: string;
  /** optional heading above the grid */
  title?: string;
}

/**
 * Normalizes an item key for fuzzy matching:
 * - lowercases
 * - strips spaces, apostrophes, hyphens
 */
function normalizeKey(k: string): string {
  return k.toLowerCase().replace(/[\s'’-]/g, '');
}

/** Try to resolve count from the provided stockpileItems with some tolerance */
function resolveCount(
  itemName: string,
  stockpileItems?: StockpileItemMap | null
): number | null {
  if (!stockpileItems) return null;

  // direct match
  if (Object.prototype.hasOwnProperty.call(stockpileItems, itemName)) {
    const v = stockpileItems[itemName];
    return typeof v === 'number' ? v : null;
  }

  // try normalized match
  const target = normalizeKey(itemName);
  for (const key of Object.keys(stockpileItems)) {
    if (normalizeKey(key) === target) {
      const v = stockpileItems[key];
      return typeof v === 'number' ? v : null;
    }
  }
  return null;
}

export const CategoryItemsGrid: FC<CategoryItemsGridProps> = ({
  category,
  itemNames,
  stockpileItems,
  imageBasePath = '/stockpile',
  title
}) => {
  // build list with counts resolved (memoized)
  const itemsWithCounts = useMemo(
    () =>
      itemNames.map((name) => ({
        name,
        count: resolveCount(name, stockpileItems)
      })),
    [itemNames, stockpileItems]
  );

  return (
    <Box sx={{ width: '100%' }}>
      {title ? (
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
      ) : null}

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
            key={it.name}
            name={it.name}
            category={category}
            // image path used by Item: /stockpile/{category}/{name}.webp
            // we pass through imageBasePath to allow custom hosting paths if needed
            // but Item builds its own path; if Item needs image prop change Item accordingly.
            count={it.count ?? null}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryItemsGrid;
