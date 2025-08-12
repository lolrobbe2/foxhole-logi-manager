import { useEffect, useState } from 'react'
import { useDiscordSdk } from '../hooks/useDiscordSdk'
import { resolvePath } from '../api/path'
import { StockpilesPage } from './pages/StockpilesPage'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'

const drawerWidth = 240

const Orders = () => <Typography>Showing Orders content here...</Typography>

const Sidebar = () => {
  const location = useLocation()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/stockpiles"
            selected={location.pathname === '/stockpiles'}
          >
            <ListItemText primary="Stockpiles" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/orders"
            selected={location.pathname === '/orders'}
          >
            <ListItemText primary="Orders" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}

export const Activity = () => {
  const { authenticated, discordSdk, status } = useDiscordSdk()
  const [channelName, setChannelName] = useState<string>()

  useEffect(() => {
    if (!authenticated || !discordSdk.channelId || !discordSdk.guildId) {
      return
    }

    discordSdk.commands.getChannel({ channel_id: discordSdk.channelId }).then((channel) => {
      if (channel.name) {
        setChannelName(channel.name)
      }
    })
  }, [authenticated, discordSdk])

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <CssBaseline />

        {/* AppBar with only Discord avatar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper' }}
          elevation={1}
        >
          <Toolbar>
            <Avatar src={resolvePath('/rocket.png')} alt="Discord" />
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            mt: 8 // space below AppBar
          }}
        >
          {channelName ? (
            <Typography variant="h5" gutterBottom>
              #{channelName}
            </Typography>
          ) : (
            <Typography variant="h6" gutterBottom>
              {status}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" mb={3}>
            Powered by <strong>Robo.js</strong>
          </Typography>

          <Routes>
            <Route path="/stockpiles" element={<StockpilesPage />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<StockpilesPage />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  )
}
