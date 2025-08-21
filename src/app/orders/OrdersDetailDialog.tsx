import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { Order } from '../objects/Orders'

interface OrderDetailsDialogProps {
  open: boolean
  onClose: () => void
  order: Order | null
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ open, onClose, order }) => {
  if (!order) return null

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{order.name} – Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          {order.type} – {order.subtype}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {order.type === 'Production'
            ? `Destination: ${order.destination.split('_').join(' → ')}`
            : `From: ${order.source.split('_').join(' → ')} → ${order.destination.split('_').join(' → ')}`}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Created by: {order.createdBy}
        </Typography>
        {order.takenBy && (
          <Typography variant="body2" gutterBottom>
            Taken by: {order.takenBy}
          </Typography>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>
          Items
        </Typography>
        <List dense>
          {order.items.map((item, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={`${item.name} × ${item.count}`} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderDetailsDialog
