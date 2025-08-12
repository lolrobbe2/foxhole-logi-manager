import React, { useEffect, useState } from 'react'
import { StockpileManager, Stockpile } from '../../api/objects/stockpile'

import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

export const StockpilesPage = () => {
  const [regions, setRegions] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>()
  const [stockpiles, setStockpiles] = useState<Stockpile[]>([])
  const [loadingRegions, setLoadingRegions] = useState<boolean>(true)
  const [loadingStockpiles, setLoadingStockpiles] = useState<boolean>(false)
  const [selectedStockpile, setSelectedStockpile] = useState<Stockpile | null>(null)

  useEffect(() => {
    async function loadRegions() {
      setLoadingRegions(true)
      const allRegions = await StockpileManager.getAllRegions()
      setRegions(allRegions)
      setLoadingRegions(false)
      if (allRegions.length > 0) {
        setSelectedRegion(allRegions[0])
      }
    }
    loadRegions()
  }, [])

  useEffect(() => {
    if (!selectedRegion) {
      setStockpiles([])
      return
    }

    async function loadStockpiles() {
      setLoadingStockpiles(true)
      const regionStockpiles = await StockpileManager.getStockpilesByRegion(selectedRegion ?? "")
      setStockpiles(regionStockpiles)
      setLoadingStockpiles(false)
      setSelectedStockpile(null)
    }
    loadStockpiles()
  }, [selectedRegion])

  return (
    <Box>
      <AppBar position="static" color="primary" sx={{ flexDirection: 'row' }}>
        <Toolbar
          variant="dense"
          sx={{ overflowX: 'auto', flexWrap: 'nowrap', whiteSpace: 'nowrap', gap: 1 }}
        >
          {loadingRegions ? (
            <CircularProgress color="inherit" size={24} />
          ) : regions.length === 0 ? (
            <Typography>No regions available</Typography>
          ) : (
            regions.map((region) => (
              <Button
                key={region}
                variant={region === selectedRegion ? 'contained' : 'text'}
                color="inherit"
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </Button>
            ))
          )}
        </Toolbar>
      </AppBar>

      {selectedRegion && (
        <AppBar
          position="static"
          color="secondary"
          sx={{ flexDirection: 'row', mt: 1, overflowX: 'auto', whiteSpace: 'nowrap', gap: 1 }}
        >
          <Toolbar variant="dense" sx={{ flexWrap: 'nowrap' }}>
            {loadingStockpiles ? (
              <CircularProgress color="inherit" size={24} />
            ) : stockpiles.length === 0 ? (
              <Typography>No stockpiles in {selectedRegion}</Typography>
            ) : (
              stockpiles.map((stockpile) => (
                <Button
                  key={stockpile.name}
                  variant={selectedStockpile?.name === stockpile.name ? 'contained' : 'text'}
                  color="inherit"
                  onClick={() => setSelectedStockpile(stockpile)}
                >
                  {stockpile.name}
                </Button>
              ))
            )}
          </Toolbar>
        </AppBar>
      )}

      <Box sx={{ p: 3 }}>
        {selectedStockpile ? (
          <>
            <Typography variant="h6" gutterBottom>
              Stockpile: {selectedStockpile.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Code: {selectedStockpile.code}
            </Typography>

            {Object.keys(selectedStockpile.items).length === 0 ? (
              <Typography>No items in this stockpile.</Typography>
            ) : (
              <Box component="ul" sx={{ pl: 4 }}>
                {Object.entries(selectedStockpile.items).map(([itemName, qty]) => (
                  <li key={itemName}>
                    {itemName}: {qty}
                  </li>
                ))}
              </Box>
            )}
          </>
        ) : (
          <Typography>Select a stockpile to see details.</Typography>
        )}
      </Box>
    </Box>
  )
}
