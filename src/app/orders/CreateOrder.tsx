import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { OrderType, ProductionSubtype, TransportSubtype } from '../objects/Orders'

interface CreateOrderProps {
  open: boolean
  onClose: () => void
  defaultType: OrderType | 'All'
  defaultSubtype: string | 'All'
}

const CreateOrder: React.FC<CreateOrderProps> = ({ open, onClose, defaultType, defaultSubtype }) => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [type, setType] = useState<OrderType>(
    defaultType !== 'All' ? defaultType : OrderType.Production
  )
  const [subtype, setSubtype] = useState<string>(
    defaultSubtype !== 'All' ? defaultSubtype : ProductionSubtype.MPF
  )

  const handleSaveDraft = () => {
    const draftOrder = { name, type, subtype, source: '', destination: '' }

    // Navigate to source selection page with draftOrder in state
    navigate('/orders/select-source', { state: { newOrder: draftOrder } })

    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Order</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Order Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <Typography variant="subtitle2">Type</Typography>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as OrderType)}
            fullWidth
          >
            {Object.values(OrderType).map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="subtitle2">Subtype</Typography>
          <Select
            value={subtype}
            onChange={(e) => setSubtype(e.target.value)}
            fullWidth
          >
            {(type === OrderType.Production
              ? Object.values(ProductionSubtype)
              : Object.values(TransportSubtype)
            ).map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSaveDraft} variant="contained" color="primary">
          Save Draft
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateOrder
