import { FC } from 'react'
import { ListItem, Avatar, IconButton, Box, Typography, Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

interface OrderTransactionProps {
    itemName: string
    image: string
    category: string
    quantity: number
    inbound?: boolean
    forceInbound?: boolean
    onChange: (delta: number) => void
    onSetQuantity?: (quantity: number) => void
    onToggleInbound?: () => void
}

export const OrderTransaction: FC<OrderTransactionProps> = ({
    itemName,
    image,
    category,
    quantity,
    inbound,
    forceInbound = false,
    onChange,
    onSetQuantity,
    onToggleInbound
}) => {
    const effectiveInbound = forceInbound ? true : inbound;

    return (
        <ListItem
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#2a2a2a',
                borderRadius: '1rem',
                mb: '0.5rem',
                px: '1rem',
                py: '0.5rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                '&:hover': { bgcolor: '#3a3a3a' }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Avatar
                    src={`/stockpile/${category}/${image}`}
                    alt={itemName}
                    sx={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', bgcolor: 'transparent' }}
                />
                <Box>
                    <Typography sx={{ color: '#e0e0d1', fontWeight: 'bold' }}>{itemName}</Typography>
                    <Box sx={{ mt: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="number"
                            value={quantity}
                            min={0}
                            onChange={(e) => onSetQuantity?.(parseInt(e.target.value) || 0)}
                            style={{
                                width: '3rem',
                                textAlign: 'center',
                                borderRadius: '0.5rem',
                                border: '1px solid #555',
                                background: '#1b1b1b',
                                color: '#fff'
                            }}
                        />
                        <Chip
                            label={effectiveInbound ? 'Inbound' : 'Outbound'}
                            onClick={!forceInbound ? onToggleInbound : undefined}
                            sx={{
                                bgcolor: effectiveInbound ? '#4caf50' : '#f44336',
                                p: '0.2rem',
                                color: '#fff',
                                cursor: forceInbound ? 'default' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            <Box>
                <IconButton size="small" sx={{ color: '#4caf50', mr: '0.25rem' }} onClick={() => onChange(1)}>
                    <AddIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#f44336' }} onClick={() => onChange(-1)}>
                    <RemoveIcon fontSize="small" />
                </IconButton>
            </Box>
        </ListItem>
    )
}
