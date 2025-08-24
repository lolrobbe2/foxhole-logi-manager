import { ListItem, Box, Typography, Chip } from '@mui/material';
import { Stockpile } from '../../objects/Stockpile';

interface OrderStockpileListItemProps {
    stockpile: Stockpile;
    onSelect: (stockpile: Stockpile) => void;
}

export const OrderStockpileListItem = ({ stockpile, onSelect }: OrderStockpileListItemProps) => {
    const parts = stockpile.name.split("_");
    const subregion = parts.length > 2 ? parts[1] : '';
    const displayName = parts.length > 2 ? parts.slice(2).join("_") : stockpile.name;

    const handleClick = () => {
        onSelect(stockpile);
    };

    return (
        <ListItem
            onClick={handleClick}
            sx={{
                flexDirection: 'column',
                alignItems: 'stretch',
                bgcolor: '#242424',
                borderRadius: '1rem',
                mb: 2,
                p: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    bgcolor: '#2e2e2e',
                    transform: 'scale(1.02)',
                },
                '&:hover .subregion-chip': {
                    bgcolor: '#e0c07c',
                },
                '&:hover .stockpile-name': {
                    color: '#e0c07c',
                },
                '&:hover .code-chip': {
                    opacity: 1,
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {subregion && (
                    <Chip
                        label={subregion}
                        className="subregion-chip"
                        sx={{
                            bgcolor: '#d4af78',
                            color: '#1b1b1b',
                            borderRadius: '2rem',
                            fontWeight: 'bold',
                            mr: 2,
                            transition: 'background-color 0.2s ease-in-out',
                        }}
                    />
                )}

                <Typography
                    className="stockpile-name"
                    sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        flexGrow: 1,
                        transition: 'color 0.2s ease-in-out',
                    }}
                >
                    {displayName}
                </Typography>

                <Chip
                    label={`Code: ${stockpile.code}`}
                    className="code-chip"
                    size="small"
                    sx={{
                        ml: 2,
                        bgcolor: '#444',
                        color: '#d4af78',
                        opacity: 0,
                        transition: 'opacity 0.2s ease-in-out, background-color 0.2s ease-in-out',
                    }}
                />
            </Box>
        </ListItem>
    );
};
