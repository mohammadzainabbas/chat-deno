import { WebSocket, isWebSocketCloseEvent } from 'https://deno.land/std/ws/mod.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { camelize } from './camelize.ts';

const users = new Map<string, WebSocket>();

const broadcast = (message: string, senderId?: string): void => {
	if (!message) return;

	for (const user of users.values()) {
		user.send(senderId ? `[${senderId}] : ${message}` : message);
	}
};

export const chat = async (ws: WebSocket): Promise<void> => {
	const userId = v4?.generate();

	users.set(userId, ws);

	broadcast(`> User '${userId}' is connected ✅`);

	for await (const event of ws) {
		const message = camelize(typeof event === 'string' ? event : '');

		broadcast(message, userId);

		if (!message && isWebSocketCloseEvent(event)) {
			users.delete(userId);

			broadcast(`> User '${userId}' is disconnected ❌`);

			break;
		}
	}
};
