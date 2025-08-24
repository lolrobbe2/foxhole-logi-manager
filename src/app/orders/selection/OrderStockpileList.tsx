import { Box, CircularProgress, List, Typography } from '@mui/material';
import { Stockpile } from '../../objects/Stockpile';
import { OrderStockpileListItem } from './OrderStockpileListItem';

interface OrderStockpileListProps {
    stockpiles: Stockpile[];
    loading: boolean;
    region: string | null;
    onSelect: (stockpile: Stockpile) => void;
}

export const OrderStockpileList = ({ stockpiles, loading, region, onSelect }: OrderStockpileListProps) => (
    <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#d4af78' }}>
            {region ? `Stockpiles in ${region}` : 'Select a region'}
        </Typography>

        {loading ? (
            <CircularProgress sx={{ color: '#d4af78' }} />
        ) : (
            <List>
                {stockpiles.map(stockpile => (
                    <OrderStockpileListItem key={stockpile.name} stockpile={stockpile} onSelect={onSelect} />
                ))}
            </List>
        )}
    </Box>
);
