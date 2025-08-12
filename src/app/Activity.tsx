import { useEffect, useState } from 'react'
import { useDiscordSdk } from '../hooks/useDiscordSdk'
import { MemoryRouter, useRoutes, RouteObject, useNavigate, useLocation, Link } from 'react-router-dom'

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

// Drawer width as relative unit for responsiveness
const drawerWidth = '10vw'

// Colors
const colors = {
  background: '#1b1b1b',
  sidebar: '#2a2a2a',
  accent: '#a67c52',
  highlight: '#5d6f5f',
  textPrimary: '#f5f5f0',
  textSecondary: 'rgba(245, 245, 240, 0.75)'
}

const Orders = () => <Typography sx={{ color: colors.textPrimary }}>Showing Orders content here...</Typography>

const routes: RouteObject[] = [
  { path: '/stockpiles', element: <StockpilesPage /> },
  { path: '/orders', element: <Orders /> },
  { path: '*', element: <StockpilesPage /> }
]

interface SidebarProps {
  currentPath: string
}

const Sidebar = (props: SidebarProps) => {
  const locationPath = props.currentPath

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
          color: colors.textPrimary,
          borderRight: `1px solid ${colors.highlight}`
        }
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 'bold',
            color: colors.accent,
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
            userSelect: 'none'
          }}
        >
          Menu
        </Typography>
      </Toolbar>
      <Divider sx={{ backgroundColor: colors.accent }} />
      <List>
        {routes
          .filter((route) => route.path !== '*')
          .map((route) => {
            const path = route.path ?? ''
            const label = path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)
            const selected = locationPath === path

            return (
              <ListItem key={path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  selected={selected}
                  sx={{
                    color: colors.textPrimary,
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                    '&.Mui-selected': {
                      backgroundColor: colors.highlight
                    },
                    '&:hover': {
                      backgroundColor: colors.highlight
                    }
                  }}
                >
                  <ListItemText
                    primary={label.charAt(0).toUpperCase() + label.slice(1)}
                    primaryTypographyProps={{
                      fontWeight: 'bold',
                      color: colors.textPrimary,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
      </List>
    </Drawer>
  )
}

const ActivityRoutes = () => {
  const element = useRoutes(routes)
  return element
}

const ActivityContent = () => {
  const { authenticated, discordSdk } = useDiscordSdk()
  const [channelName, setChannelName] = useState<string>()

  const navigate = useNavigate()
  const location = useLocation()

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

  // Redirect '/' to '/stockpiles' on mount or when location is '/'
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/stockpiles', { replace: true })
    }
  }, [location.pathname, navigate])

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: colors.background }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar currentPath={location.pathname} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: colors.background,
          p: 3,
          mt: 8,
          color: colors.textPrimary,
          overflowY: 'auto'
        }}
      >
        <ActivityRoutes />
      </Box>
    </Box>
  )
}

// Main export, wraps in MemoryRouter with initialEntries
export const Activity = (props: { location?: string }) => {
  const initialPath = props.location ?? '/'

  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <ActivityContent />
    </MemoryRouter>
  )
}
