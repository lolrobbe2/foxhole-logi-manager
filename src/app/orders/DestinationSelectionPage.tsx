import { useLocation, useNavigate } from 'react-router-dom'
import { SelectionPage } from './RegionSelectionPage'
import { Stockpile } from '../objects/Stockpile'

export const DestinationSelectionPage = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const { newOrder } = location.state as { newOrder: any }

	const handleSelect = (stockpile: Stockpile) => {
		const updatedOrder = { ...newOrder, destination: stockpile.name }

		// TODO: Don't create the order yet, we still need to select items
		// You can pass updatedOrder to the next page for item selection
		navigate('/orders/select-items', { state: { newOrder: updatedOrder } })
	}

	return <SelectionPage title="Select Destination" onSelect={handleSelect} />
}
