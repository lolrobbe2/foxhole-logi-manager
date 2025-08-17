import type { RoboRequest } from '@robojs/server'

export default async (req: RoboRequest) => {
	const urlParam = new URL(req.url, 'http://logiwaze.com  ').searchParams.get('url')
	if (!urlParam) {
		return new Response('Missing "url" query parameter', { status: 400 })
	}

	console.log('Proxying to:', urlParam)

	// Handle root HTML fetch & rewrite

	// Forward other requests
	try {
		if (urlParam.endsWith('.js')) req.headers.set('Content-Type', 'application/javascript')
		if (urlParam.endsWith('.css')) req.headers.set('Content-Type', 'text/css')
		if (urlParam.endsWith('.json')) req.headers.set('Content-Type', 'application/json')
		if (urlParam.endsWith('.webmanifest')) req.headers.set('Content-Type', 'application/manifest+json')
		if (urlParam.endsWith('.wasm')) req.headers.set('Content-Type', 'application/wasm')
		if (urlParam.endsWith('.webp')) req.headers.set('Content-Type', 'image/webp')
		else {
			if (req.url.includes('/api/proxy')) {
				try {
					const response = await fetch(urlParam)
					let html = await response.text()

					// Only rewrite relative URLs (starting with / or no scheme)
					html = html.replace(/(href|src|srcset)=["'](\/[^"']*)["']/g, (_, attr, path) => {
						return `${attr}="/api/proxy?url=${new URL(path, urlParam).toString()}"`
					})
					html = html.replace(/(["'`])(Tiles\/[^"'`]+)\1/g, (_, q, path) => {
						return `${q}/api/proxy?url=${urlParam}${path}${q}`
					})
					return new Response(html, {
						status: 200,
						headers: {
							'Content-Type': 'text/html; charset=utf-8'
						}
					})
				} catch (err) {}
			}
		}
		const proxiedResponse = await fetch(urlParam, {
			method: req.method,
			headers: req.headers as any,
			body: req.body
		})
		const contentType = proxiedResponse.headers.get('content-type') || ''

		if (contentType.includes('javascript')) {
			console.log('test')
			const js = await proxiedResponse.text()
			let body: BodyInit = proxiedResponse.body!
			const headers = new Headers(proxiedResponse.headers)
			body = js.replace(/(["'`])(Tiles\/[^"'`]+)\1/g, (_, q, path) => {
				return `${q}/api/proxy?url=${path}${q}`
			})
			headers.set('Content-Type', 'application/javascript')
			return new Response(body, {
				status: proxiedResponse.status,
				headers
			})
		}
		const headers = new Headers(proxiedResponse.headers)
		return new Response(proxiedResponse.body, {
			status: proxiedResponse.status,
			headers
		})
	} catch (err) {
		return new Response('Error forwarding request', { status: 500 })
	}
}
