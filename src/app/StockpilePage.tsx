import { useEffect, useState } from 'react';
import {
  Drawer,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { StockpileManager } from '../app/objects/Stockpile';

const regionDrawerWidth = 200;

export const StockpilesPage = () => {
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [stockpiles, setStockpiles] = useState<Stockpile[]>([]);
  const [loadingRegions, setLoadingRegions] = useState<boolean>(true);
  const [loadingStockpiles, setLoadingStockpiles] = useState<boolean>(false);

  // Load regions
  useEffect(() => {
    async function loadRegions() {
      setLoadingRegions(true);
      const allRegions: string[] = await StockpileManager.getAllRegions();
      setRegions(allRegions);
      setLoadingRegions(false);
      if (allRegions !== null &&  allRegions.length > 0) {
        setSelectedRegion(allRegions[0]);
      }
    }
    loadRegions();
  }, []);

  // Load stockpiles for selected region
  useEffect(() => {
    if (!selectedRegion) {
      setStockpiles([]);
      return;
    }
    async function loadStockpiles() {
      setLoadingStockpiles(true);
      const regionStockpiles = await StockpileManager.getStockpilesByRegion(selectedRegion ?? "");
      setStockpiles(regionStockpiles);
      setLoadingStockpiles(false);
    }
    loadStockpiles();
  }, [selectedRegion]);

  return (
    <Box sx={{ display: 'flex', height: '100%', bgcolor: '#1b1b1b', color: '#f5f5f0' }}>
      {/* Regions Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: regionDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: regionDrawerWidth,
            boxSizing: 'border-box',
            marginLeft: '10vw',
            bgcolor: '#2a2a2a',
            color: '#f5f5f0',
            borderRight: '1px solid #444'
          }
        }}
      >
        <Toolbar sx={{ bgcolor: '#2f2f2f', color: '#d4af78' }}>
          <Typography variant="h6" noWrap>
            Regions
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: '#444' }} />
        {loadingRegions ? (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={24} sx={{ color: '#d4af78' }} />
          </Box>
        ) : regions.length === 0 ? (
          <Typography sx={{ p: 2, color: '#aaa' }}>No regions found.</Typography>
        ) : (
          <List>
            {regions.map((region) => (
              <ListItem key={region} disablePadding>
                <ListItemButton
                  selected={selectedRegion === region}
                  onClick={() => setSelectedRegion(region)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: '#3d3d3d',
                      color: '#fff',
                      '&:hover': { bgcolor: '#4a4a4a' }
                    },
                    '&:hover': { bgcolor: '#333' }
                  }}
                >
                  <ListItemText
                    primary={region}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#d4af78' }}>
          {selectedRegion ? `Stockpiles in ${selectedRegion}` : 'Select a region'}
        </Typography>

        {loadingStockpiles ? (
          <CircularProgress sx={{ color: '#d4af78' }} />
        ) : stockpiles.length === 0 ? (
          <Typography sx={{ color: '#aaa' }}>No stockpiles in this region.</Typography>
        ) : (
          <List>
            {stockpiles.map((stockpile) => (
              <ListItem
                key={stockpile.name}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  bgcolor: '#242424',
                  borderRadius: '0.5rem',
                  mb: 2,
                  p: 2
                }}
              >
                <ListItemText
                  primary={stockpile.name}
                  primaryTypographyProps={{ color: '#fff', fontWeight: 'bold' }}
                  secondary={`Code: ${stockpile.code}`}
                  secondaryTypographyProps={{ color: '#aaa' }}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ ml: 2 }}>
                  {Object.entries(stockpile.items).length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#777' }}>
                      No items
                    </Typography>
                  ) : (
                    Object.entries(stockpile.items).map(([itemName, qty]) => (
                      <Typography key={itemName} variant="body2" sx={{ color: '#ccc' }}>
                        {itemName}: {String(qty)}
                      </Typography>
                    ))
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};
