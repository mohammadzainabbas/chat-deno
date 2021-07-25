import { listenAndServe } from 'https://deno.land/std/http/server.ts';
import { acceptWebSocket, acceptable } from 'https://deno.land/std/ws/mod.ts';
import { chat } from './utils/chat.ts';

const options = { port: 3000 };

listenAndServe(options, async (req) => {
	const { method, respond, url } = req;

	if (method === 'GET' && url === '/') {
		respond({
			status: 200,
			headers: new Headers({
				'content-type': 'text/html',
			}),
			body: await Deno.open('public/index.html'),
		});
	}

	// WebSockets Chat
	if (method === 'GET' && url === '/ws') {
		if (acceptable(req)) {
			const { conn, r, w, headers } = req;
			acceptWebSocket({
				conn,
				bufReader: r,
				bufWriter: w,
				headers,
			}).then(chat);
		}
	}
});

console.log('👨🏻‍💻 Hello from Deno Server 👋🏻 ');
