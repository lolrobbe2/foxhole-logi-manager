import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { StockpilesPage } from './StockpilePage'

const colors = {
  background: '#1b1b1b', // deep dark steel
  sidebar: '#2a2a2a', // slightly lighter for sidebar
  accent: '#7a5c3c', // muted brown/bronze
  highlight: '#4a5c4d', // olive-gray for hover/selected
  text: '#e0e0d1' // off-white
}

const Orders = () => (
  <Typography variant="body1" sx={{ color: colors.text }}>
    Showing Orders content here...
  </Typography>
)

const NotFoundPage = () => (
  <Typography variant="body1" sx={{ color: colors.text }}>
    Page not found.
  </Typography>
)

const UserPage = ({ id }: { id: string }) => {
  switch (id) {
    case 'stockpiles':
      return <StockpilesPage />
    case 'orders':
      return <Orders />
    default:
      return <NotFoundPage />
  }
}
export default UserPage
