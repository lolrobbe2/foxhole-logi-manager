import type { RoboRequest } from '@robojs/server';

export default async (req: RoboRequest) => {
    const TARGET = 'https://www.logiwaze.com/';
    console.log(req.url)
    // Handle the root HTML request
    if (req.url.endsWith('/api/proxy')) {
        try {
            const response = await fetch(TARGET);
            let html = await response.text();

            // Rewrite all URLs to go through the proxy
            html = html
                .replace(/(href|src|srcset)=["']\/?/g, `$1="/api/proxy/`)
                .replace(/https:\/\/www\.logiwaze\.com\//g, '/api/proxy/');

            return new Response(html, {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8'
                }
            });
        } catch (err) {
            return new Response('Error fetching target site', { status: 500 });
        }
    }

    // For other /proxy/* requests, just forward them
    const targetUrl = TARGET + req.url.replace(/^\/proxy/, '');
    const proxiedResponse = await fetch(targetUrl, {
        method: req.method,
        headers: req.headers as any,
        body: req.body
    });

    // Clone headers
    const headers = new Headers(proxiedResponse.headers);
    return new Response(proxiedResponse.body, {
        status: proxiedResponse.status,
        headers
    });
};
