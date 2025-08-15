import { Drawer, Toolbar, Divider, List, ListItem, ListItemButton, ListItemText, CircularProgress, Box, Typography } from '@mui/material';

interface RegionDrawerProps {
    regions: string[];
    selectedRegion: string | null;
    onSelectRegion: (region: string) => void;
    loading: boolean;
    drawerWidth?: number;
}

export const RegionDrawer = ({ regions, selectedRegion, onSelectRegion, loading, drawerWidth = 200 }: RegionDrawerProps) => (
    <Drawer
        variant="permanent"
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                marginLeft: '10vw',
                bgcolor: '#2a2a2a',
                color: '#f5f5f0',
                borderRight: '1px solid #444'
            }
        }}
    >
        <Toolbar sx={{ bgcolor: '#2f2f2f', color: '#d4af78' }}>
            <Typography variant="h6" noWrap>Regions</Typography>
        </Toolbar>
        <Divider sx={{ borderColor: '#444' }} />
        {loading ? (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#d4af78' }} />
            </Box>
        ) : regions.length === 0 ? (
            <Typography sx={{ p: 2, color: '#aaa' }}>No regions found.</Typography>
        ) : (
            <List>
                {regions.map(region => (
                    <ListItem key={region} disablePadding>
                        <ListItemButton
                            selected={selectedRegion === region}
                            onClick={() => onSelectRegion(region)}
                            sx={{
                                '&.Mui-selected': {
                                    bgcolor: '#3d3d3d',
                                    color: '#fff',
                                    '&:hover': { bgcolor: '#4a4a4a' }
                                },
                                '&:hover': { bgcolor: '#333' }
                            }}
                        >
                            <ListItemText primary={region} primaryTypographyProps={{ fontWeight: 'bold' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        )}
    </Drawer>
);
