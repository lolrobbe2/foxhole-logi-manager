import { Box, CircularProgress, List, Typography } from '@mui/material';
import { Stockpile } from '../../app/objects/Stockpile';
import { StockpileListItem } from './StockpileListItem';

interface StockpileListProps {
    stockpiles: Stockpile[];
    loading: boolean;
    region: string | null;
}

export const StockpileList = ({ stockpiles, loading, region }: StockpileListProps) => (
    <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#d4af78' }}>
            {region ? `Stockpiles in ${region}` : 'Select a region'}
        </Typography>

        {loading ? (
            <CircularProgress sx={{ color: '#d4af78' }} />
        ) : (
            <List>
                {stockpiles.map(stockpile => (
                    <StockpileListItem key={stockpile.name} stockpile={stockpile} />
                ))}
            </List>
        )}
    </Box>
);
