import { Box } from '@mui/material'
import { MouseEvent, WheelEvent, useEffect, useRef, useState } from 'react'
import { WindDial } from './WindDirectionControl'
import { ArtilleryGun } from './artilleryGuns'

interface Point {
	x: number
	y: number
}

interface SelectedGun {
	mindistance: number
	maxdistance: number
	dispersion: [number, number]
	windDeviation: number[]
}

interface Wind {
	direction: number
	strength: number
}

interface RegionMapProps {
	region: string
	onMeasure?: (data: { distance: number; azimuth: number; distanceWithWind?: number; azimuthWithWind?: number }) => void
	selectedGun?: SelectedGun | null
	level?: number | null
}

export const RegionMap = ({ region, onMeasure, selectedGun, level }: RegionMapProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const imageRef = useRef<HTMLImageElement>(null)
	const [points, setPoints] = useState<Point[]>([])
	const [offset, setOffset] = useState({ x: 0, y: 0 })
	const draggingRef = useRef<{ x: number; y: number } | null>(null)
	const [scale, setScale] = useState<number>(1)
	const [measurement, setMeasurement] = useState<{
		distance: number
		azimuth: number
		distanceWithWind?: number
		azimuthWithWind?: number
	} | null>(null)
	const [pixelToMeter, setPixelToMeter] = useState<number>(0.93622857142)
	const [wind, setWind] = useState<Wind>({ direction: 0, strength: 0 })
	console.log(scale)
	// Update pixelToMeter based on image width
	useEffect(() => {
		const img = imageRef.current
		if (img) {
			const rect = img.getBoundingClientRect()
			setPixelToMeter(rect.width / 2187.5)
		}
	}, [region, scale])

	// Distance & azimuth calculation
	// Distance & azimuth calculation
	useEffect(() => {
		if (points.length !== 2 || pixelToMeter <= 0) {
			if (measurement !== null) setMeasurement(null)
			return
		}

		// Adjust points for zoom
		const p1 = { x: points[0].x * scale, y: points[0].y * scale }
		const p2 = { x: points[1].x * scale, y: points[1].y * scale }

		const { distance, azimuth } = calculateDistanceAndAzimuth(p1, p2, pixelToMeter)

		let distanceWithWind: number | null
		let azimuthWithWind: number | null

		if (level !== null && selectedGun != null) {
			const windStrength = selectedGun?.windDeviation[level! - 1]
			const windWithStrength = { direction: wind.direction, strength: windStrength }
			;({ distance: distanceWithWind, azimuth: azimuthWithWind } = compensateWind(distance, azimuth, windWithStrength))
		}

		const newMeasurement = { distance, azimuth, distanceWithWind, azimuthWithWind }
		const epsilon = 0.0001

		if (
			!measurement ||
			Math.abs(measurement.distance - distance) > epsilon ||
			Math.abs(measurement.azimuth - azimuth) > epsilon ||
			(distanceWithWind !== undefined && Math.abs((measurement.distanceWithWind ?? 0) - distanceWithWind) > epsilon) ||
			(azimuthWithWind !== undefined && Math.abs((measurement.azimuthWithWind ?? 0) - azimuthWithWind) > epsilon)
		) {
			setMeasurement(newMeasurement)
			if (onMeasure) onMeasure(newMeasurement)
		}
	}, [points, pixelToMeter, wind, level, scale])

	// Panning
	const handleMouseDown = (e: React.MouseEvent) => {
		if (e.button === 1) {
			draggingRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
		}
	}

	const handleMouseMove = (e: React.MouseEvent) => {
		if (draggingRef.current) {
			const container = containerRef.current
			const img = imageRef.current
			if (!container || !img) return

			let newX = e.clientX - draggingRef.current.x
			let newY = e.clientY - draggingRef.current.y

			const containerRect = container.getBoundingClientRect()
			const imgRect = img.getBoundingClientRect()
			const scaledWidth = img.width * scale
			const scaledHeight = img.height * scale

			// Constrain within container
			newX = Math.min(0, Math.max(containerRect.width - scaledWidth, newX))
			newY = Math.min(0, Math.max(containerRect.height - scaledHeight, newY))

			setOffset({ x: newX, y: newY })
		}
	}

	const handleMouseUp = () => {
		draggingRef.current = null
	}

	// Zooming
	const handleWheel = (e: WheelEvent) => {
		const img = imageRef.current
		const container = containerRef.current
		if (!img || !container) return

		const rect = container.getBoundingClientRect()
		const delta = -e.deltaY * 0.001 // zoom sensitivity
		const newScale = Math.min(5, Math.max(0.5, scale + delta))

		// Zoom relative to cursor
		const mouseX = e.clientX - rect.left - offset.x
		const mouseY = e.clientY - rect.top - offset.y

		const ratio = newScale / scale

		let newOffsetX = offset.x - mouseX * (ratio - 1)
		let newOffsetY = offset.y - mouseY * (ratio - 1)

		// Constrain within container
		const scaledWidth = img.width * newScale
		const scaledHeight = img.height * newScale
		newOffsetX = Math.min(0, Math.max(rect.width - scaledWidth, newOffsetX))
		newOffsetY = Math.min(0, Math.max(rect.height - scaledHeight, newOffsetY))

		setScale(newScale)
		setOffset({ x: newOffsetX, y: newOffsetY })
	}

	// Clicking to add points
	const handleClick = (e: MouseEvent<HTMLImageElement>) => {
		const container = containerRef.current
		const img = imageRef.current
		if (!container || !img) return
		const rect = container.getBoundingClientRect()

		const clickX = (e.clientX - rect.left - offset.x) / scale
		const clickY = (e.clientY - rect.top - offset.y) / scale
		if (e.ctrlKey && points.length > 1) {
			setPoints((prev) => {
				const updated = [...prev]
				updated[1] = { x: clickX, y: clickY }
				return updated
			})
		} else {
			setPoints((prev) => (prev.length >= 2 ? [{ x: clickX, y: clickY }] : [...prev, { x: clickX, y: clickY }]))
		}
	}

	return (
		<Box
			ref={containerRef}
			sx={{
				ml: '5vw',
				width: '100%',
				height: '100vh',
				position: 'relative',
				overflow: 'hidden',
				cursor: draggingRef.current ? 'grabbing' : 'default'
			}}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onWheel={handleWheel}
		>
			{/* Measurement Banner */}
			{measurement && (
				<Box
					sx={{
						position: 'absolute',
						top: '1rem',
						left: '50%',
						transform: 'translateX(-50%)',
						bgcolor: 'rgba(0,0,0,0.7)',
						color: 'white',
						px: 2,
						py: 1,
						borderRadius: '0.5rem',
						fontSize: '1rem',
						zIndex: 10
					}}
				>
					Distance: {measurement.distance.toFixed(1)} m | Azimuth: {measurement.azimuth.toFixed(1)}°
					{measurement.distanceWithWind !== undefined && measurement.azimuthWithWind !== undefined && (
						<Box
							component="span"
							sx={{
								color: selectedGun && measurement.distanceWithWind > selectedGun.maxdistance ? 'orange' : 'lightgreen'
							}}
						>
							{' '}
							| With Wind: {measurement.distanceWithWind.toFixed(1)} m @ {measurement.azimuthWithWind.toFixed(1)}°
							{selectedGun && (
								<>
									{' '}
									| Dispersion:{' '}
									{getDispersionAtDistance(
										selectedGun.dispersion,
										measurement.distanceWithWind,
										selectedGun.mindistance,
										selectedGun.maxdistance
									).toFixed(2)}
								</>
							)}
						</Box>
					)}
				</Box>
			)}

			{/* Map Image */}
			<Box
				ref={containerRef}
				sx={{
					width: '54vw',
					height: '95vh',
					position: 'relative',
					overflow: 'hidden',
					border: '0.25rem solid #ccc', // border stays fixed
					borderRadius: '0.5rem',
					boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.2)',
					cursor: draggingRef.current ? 'grabbing' : 'default'
				}}
				onWheel={handleWheel} // zoom only
			>
				<Box
					component="img"
					ref={imageRef}
					src={`/Map/Map${region}.webp`}
					alt={region}
					onClick={handleClick}
					sx={{
						display: 'block',
						userSelect: 'none',
						cursor: 'crosshair',
						transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
						transformOrigin: 'top left'
					}}
				/>

				{/* Points */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						pointerEvents: 'none',
						transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
						transformOrigin: 'top left'
					}}
				>
					{points.length === 2 && (
						<Box
							sx={{
								position: 'absolute',
								left: `${points[0].x}px`,
								top: `${points[0].y}px`,
								width: `${Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y)}px`,
								height: '2px',
								bgcolor: 'yellow',
								transform: `translate(0, -1px) rotate(${Math.atan2(
									points[1].y - points[0].y,
									points[1].x - points[0].x
								)}rad)`,
								transformOrigin: '0 0'
							}}
						/>
					)}
					{/* Min/Max distance & Dispersion circles */}
					{points.length > 0 && selectedGun && (
						<>
							{/* Min distance */}
							<Box
								sx={{
									position: 'absolute',
									left: `${points[0].x}px`,
									top: `${points[0].y}px`,
									width: `${selectedGun.mindistance * 2}px`,
									height: `${selectedGun.mindistance * 2}px`,
									bgcolor: 'rgba(0, 0, 0, 0.3)', // see-through black tint

									border: '2px dashed red',
									borderRadius: '50%',
									transform: 'translate(-50%, -50%)'
								}}
							/>

							{/* Max distance */}
							<Box
								sx={{
									position: 'absolute',
									left: `${points[0].x}px`,
									top: `${points[0].y}px`,
									width: `${selectedGun.maxdistance * 2}px`,
									height: `${selectedGun.maxdistance * 2}px`,

									border: '2px dashed lightgreen',
									borderRadius: '50%',
									transform: 'translate(-50%, -50%)'
								}}
							/>

							{/* Dispersion */}
							{selectedGun.dispersion &&
								points.length > 1 &&
								measurement != null &&
								measurement!.distanceWithWind !== null && (
									<Box
										sx={{
											position: 'absolute',
											left: `${points[1].x}px`,
											top: `${points[1].y}px`,
											width: `${getDispersionAtDistance(selectedGun.dispersion, measurement!.distanceWithWind!, selectedGun.mindistance, selectedGun.maxdistance) * 2}px`,
											height: `${getDispersionAtDistance(selectedGun.dispersion, measurement!.distanceWithWind!, selectedGun.mindistance, selectedGun.maxdistance) * 2}px`,
											border: '2px dashed orange',
											borderRadius: '50%',
											transform: 'translate(-50%, -50%)'
										}}
									/>
								)}
						</>
					)}

					{points.map((p, i) => (
						<Box
							key={i}
							sx={{
								position: 'absolute',
								left: `${p.x}px`,
								top: `${p.y}px`,
								width: '10px',
								height: '10px',
								bgcolor: i === 0 ? 'red' : 'blue',
								borderRadius: '50%',
								transform: 'translate(-50%, -50%)'
							}}
						/>
					))}
				</Box>
			</Box>

			{/* Wind Dial */}
			<WindDial onChange={(dir) => setWind((prev) => ({ ...prev, direction: dir }))} />
		</Box>
	)
}

// Distance & azimuth
function calculateDistanceAndAzimuth(p1: Point, p2: Point, pixelToMeter: number) {
	const dx = p2.x - p1.x
	const dy = p2.y - p1.y
	const distance = Math.sqrt(dx * dx + dy * dy) / pixelToMeter
	const azimuth = (Math.atan2(dx, -dy) * 180) / Math.PI
	return { distance, azimuth: (azimuth + 360) % 360 }
}

// Wind compensation
function compensateWind(targetDistance: number, targetAzimuth: number, wind: Wind) {
	const azRad = (targetAzimuth * Math.PI) / 180
	const windRad = (wind.direction * Math.PI) / 180

	const dx = targetDistance * Math.sin(azRad) - wind.strength * Math.sin(windRad)
	const dy = targetDistance * Math.cos(azRad) - wind.strength * Math.cos(windRad)

	const compensatedDistance = Math.sqrt(dx * dx + dy * dy)
	const compensatedAzimuth = (Math.atan2(dx, dy) * 180) / Math.PI

	return { distance: compensatedDistance, azimuth: (compensatedAzimuth + 360) % 360 }
}

function getDispersionAtDistance(
	dispersion: [number, number],
	distance: number,
	mindistance: number,
	maxdistance: number
): number {
	const [dispMin, dispMax] = dispersion

	if (distance <= mindistance) return dispMin
	if (distance >= maxdistance) return dispMax

	const t = (distance - mindistance) / (maxdistance - mindistance)
	return dispMin + t * (dispMax - dispMin)
}
