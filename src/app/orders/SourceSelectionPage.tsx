    import { useLocation, useNavigate } from 'react-router-dom';
import { SelectionPage } from './RegionSelectionPage';
import { Stockpile } from '../objects/Stockpile';

export const SourceSelectionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { newOrder } = location.state as { newOrder: any }; // type properly if needed

    function handleSelect(stockpile: Stockpile) {
        // Update the newOrder object
        const updatedOrder = { ...newOrder, source: stockpile.name };

        // Go to destination selection page
        navigate('/orders/select-destination', { state: { newOrder: updatedOrder } });
    };

    return <SelectionPage title="Select Source" onSelect={handleSelect} />;
};
