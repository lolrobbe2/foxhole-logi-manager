import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'


const colors = {
	background: '#1b1b1b',
	sidebar: '#2a2a2a',
	accent: '#7a5c3c',
	highlight: '#4a5c4d',
	text: '#e0e0d1'
}

export default function HomePage() {
	const settings = {
		dots: false,
		infinite: true,
		speed: 800,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 7000,
		arrows: false,
		pauseOnHover: false,
		fade: false,
		initialSlide: 0
	}

	return (
		<div
			className="w-full h-screen bg-black overflow-hidden"
			style={{
				color: colors.text,
				margin: 0,
				padding: 0,
				position: 'relative',
				height: '100vh',
				boxSizing: 'border-box'
			}}
		>
			{/* Floated carousel with lower z-index */}
			<div
				style={{
					float: 'left',
					width: '100%',
					height: '100%',
					zIndex: 1,
					position: 'relative',
					overflow: 'hidden'
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '90%',
						height: '90%',
						zIndex: 2
					}}
				></div>

				<Carousel
					autoPlay
					infiniteLoop
					interval={15000}
					showThumbs={false}
					showStatus={false}
					showIndicators={false}
					stopOnHover={false}
					swipeable
					emulateTouch
				>
					{['demo1', 'demo2'].map((vid, idx) => (
						<div key={idx} style={{ height: '100vh', position: 'relative' }}>
							<video
								src={`/videos/${vid}.webm`}
								autoPlay
								loop
								muted
								playsInline
								preload="auto"
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									objectPosition: 'center',
									display: 'block'
								}}
							/>
						</div>
					))}
				</Carousel>
			</div>

			{/* Floated content with higher z-index */}
			<div
				style={{
					textAlign: 'center',
					width: '100%',
					float: 'left',
					marginTop: '-100vh',
					zIndex: 2,
					position: 'relative'
				}}
			>
				<div
					style={{
						display: 'inline-block',
						backgroundColor: 'rgba(42, 42, 42, 0.5)', // semi-transparent
						padding: '1rem',
						borderRadius: '1rem',
						marginTop: '10rem',
						backdropFilter: 'blur(8px)', // adds glassy blur
						WebkitBackdropFilter: 'blur(8px)', // Safari support
						boxShadow: '0 0 20px rgba(0,0,0,0.3)'
					}}
				>
					<h2 style={{ fontSize: '4rem', color: colors.highlight, marginBottom: '1.5rem' }}>The VOID Fox Tool</h2>
					<p style={{ fontSize: '1.25rem', color: colors.text }}>
						Step into the shadows of productivity. This is your command center.
					</p>
				</div>
			</div>
		</div>
	)
}
