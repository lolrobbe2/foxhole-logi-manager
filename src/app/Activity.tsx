import React, { useEffect, useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  useLocation
} from 'react-router-dom'

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

import { useDiscordSdk } from '../hooks/useDiscordSdk'
import { resolvePath } from '../api/path'
import { StockpilesPage } from './pages/StockpilesPage'

const drawerWidth = 240

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

const RootLayout = () => {
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
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper' }}
        elevation={1}
      >
        <Toolbar>
          <Avatar src={resolvePath('/rocket.png')} alt="Discord" />
        </Toolbar>
      </AppBar>

      <Sidebar />

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

        {/* Render matching route element here */}
        <Outlet />
      </Box>
    </Box>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <StockpilesPage /> },
      { path: 'stockpiles', element: <StockpilesPage /> },
      { path: '*', element: <StockpilesPage /> }
    ]
  }
])

export const Activity = () => {
  return <RouterProvider router={router} />
}
