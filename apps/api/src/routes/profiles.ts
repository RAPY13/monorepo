import { Hono } from 'hono';
export const profilesRoute = new Hono();
profilesRoute.get('/', c => c.json({ data: [], message: 'Profiles placeholder' }));
