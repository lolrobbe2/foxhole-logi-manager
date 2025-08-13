import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Autocomplete,
	CircularProgress
} from '@mui/material'
import { FoxholeApi } from '../objects/Foxhole'
import { StockpileManager } from '../objects/Stockpile'

interface CreateStockpileDialogProps {
	open: boolean
	onClose: () => void
	onCreated?: () => void
}

export const CreateStockpileDialog = ({ open, onClose, onCreated }: CreateStockpileDialogProps) => {
	const [regions, setRegions] = useState<string[]>([])
	const [selectedRegionRaw, setSelectedRegionRaw] = useState<string | null>(null)
	const [selectedRegionDisplay, setSelectedRegionDisplay] = useState<string | null>(null)

	const [subregions, setSubregions] = useState<string[]>([])
	const [selectedSubregion, setSelectedSubregion] = useState<string | null>(null)

	const [name, setName] = useState<string>('')
	const [code, setCode] = useState<string>('')

	const [loadingRegions, setLoadingRegions] = useState<boolean>(false)
	const [loadingSubregions, setLoadingSubregions] = useState<boolean>(false)

	const formatRegionName = (name: string) => {
		return name
			.replace(/Hex$/, '')
			.replace(/([A-Z])/g, ' $1')
			.trim()
	}

	useEffect(() => {
		if (open) {
			setLoadingRegions(true)
			FoxholeApi.getRegions()
				.then((data) => {
					setRegions(data)
					if (data.length > 0) {
						setSelectedRegionRaw(data[0])
						setSelectedRegionDisplay(formatRegionName(data[0]))
					}
				})
				.finally(() => setLoadingRegions(false))
		} else {
			setSelectedRegionRaw(null)
			setSelectedRegionDisplay(null)
			setSelectedSubregion(null)
			setName('')
			setCode('')
			setSubregions([])
		}
	}, [open])

	useEffect(() => {
		if (selectedRegionRaw) {
			setLoadingSubregions(true)
			FoxholeApi.getSubregions(selectedRegionRaw)
				.then((data) => {
					setSubregions(data)
					if (data.length > 0) setSelectedSubregion(data[0])
				})
				.finally(() => setLoadingSubregions(false))
		} else {
			setSubregions([])
			setSelectedSubregion(null)
		}
	}, [selectedRegionRaw])

	const handleCreate = async () => {
		if (!selectedRegionDisplay || !selectedSubregion || !name.trim() || !/^[a-zA-Z0-9]{6}$/.test(code)) return

		try {
			await StockpileManager.createEmptyStockpile(selectedRegionDisplay, selectedSubregion, name.trim(), code.trim())
			if (onCreated) onCreated()
			onClose()
		} catch (err) {
		}
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{ sx: { minHeight: '450px', p: '2rem' } }} // add padding around dialog
		>
			<DialogTitle
				sx={{
					textAlign: 'center',
					mb: '1rem' // margin bottom
				}}
			>
				Create Stockpile
			</DialogTitle>

			<DialogContent
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1.5rem', // increased from 1rem
					mt: 1 // small margin above first field
				}}
			>
				<Autocomplete
					options={regions}
					getOptionLabel={(option) => formatRegionName(option)}
					value={selectedRegionRaw}
					onChange={(_, newValue) => {
						setSelectedRegionRaw(newValue)
						setSelectedRegionDisplay(newValue ? formatRegionName(newValue) : null)
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Region"
							variant="outlined"
							fullWidth
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<>
										{loadingRegions ? <CircularProgress size={20} /> : null}
										{params.InputProps.endAdornment}
									</>
								)
							}}
						/>
					)}
					disabled={loadingRegions}
					autoHighlight
					filterSelectedOptions
				/>

				<Autocomplete
					options={subregions}
					value={selectedSubregion}
					onChange={(_, newValue) => setSelectedSubregion(newValue)}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Subregion"
							variant="outlined"
							fullWidth
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<>
										{loadingSubregions ? <CircularProgress size={20} /> : null}
										{params.InputProps.endAdornment}
									</>
								)
							}}
						/>
					)}
					disabled={!selectedRegionRaw || loadingSubregions}
					autoHighlight
					filterSelectedOptions
				/>

				<TextField
					label="Stockpile Name"
					fullWidth
					variant="outlined"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<TextField
					label="Stockpile Code (6 chars)"
					fullWidth
					variant="outlined"
					value={code}
					onChange={(e) => {
						// only allow up to 6 alphanumeric characters
						const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)
						setCode(val)
					}}
					helperText="Exactly 6 alphanumeric characters"
				/>
			</DialogContent>

			<DialogActions sx={{ mt: '1rem' }}>
				<Button onClick={onClose} color="secondary">
					Cancel
				</Button>
				<Button
					onClick={handleCreate}
					color="primary"
					variant="contained"
					disabled={!selectedRegionDisplay || !selectedSubregion || !name.trim() || code.length !== 6}
				>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	)
}
