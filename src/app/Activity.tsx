import { useEffect, useState } from 'react'
import { useDiscordSdk } from '../hooks/useDiscordSdk'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Toolbar from '@mui/material/Toolbar'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import { StockpilesPage } from './StockpilePage'
import UserPage from './UserPage'

const drawerWidth = '10vw'

// Foxhole military-inspired color palette
const colors = {
  background: '#1b1b1b', // deep dark steel
  sidebar: '#2a2a2a', // slightly lighter for sidebar
  accent: '#7a5c3c', // muted brown/bronze
  highlight: '#4a5c4d', // olive-gray for hover/selected
  text: '#e0e0d1' // off-white
}

const Sidebar = ({ activeId }: { activeId: string }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: colors.sidebar,
          color: colors.text
        }
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ color: colors.accent }}>
          Menu
        </Typography>
      </Toolbar>
      <Divider sx={{ backgroundColor: colors.accent }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="#stockpiles"
            selected={activeId === 'stockpiles'}
            sx={{
              '&.Mui-selected': {
                backgroundColor: colors.highlight
              },
              '&:hover': {
                backgroundColor: colors.highlight
              }
            }}
          >
            <ListItemText primary="Stockpiles" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="#orders"
            selected={activeId === 'orders'}
            sx={{
              '&.Mui-selected': {
                backgroundColor: colors.highlight
              },
              '&:hover': {
                backgroundColor: colors.highlight
              }
            }}
          >
            <ListItemText primary="Orders" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}

export const Activity = () => {
  const { authenticated, discordSdk } = useDiscordSdk()
  const [channelName, setChannelName] = useState<string>()
  const [activeId, setActiveId] = useState<string>(() => {
    // initialize from current hash or default to "stockpiles"
    return window.location.hash ? window.location.hash.slice(1) : 'stockpiles'
  })

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

  useEffect(() => {
    // Listen for hash changes and update activeId state
    const onHashChange = () => {
      const hash = window.location.hash.slice(1)
      setActiveId(hash || 'stockpiles') // fallback to stockpiles
    }

    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: colors.background }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar activeId={activeId} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: colors.background,
          p: 3,
          mt: 8
        }}
      >
        <UserPage id={activeId} />
      </Box>
    </Box>
  )
}
