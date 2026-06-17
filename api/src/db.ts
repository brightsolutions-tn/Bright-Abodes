import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const rawToken = process.env.DATABASE_AUTH_TOKEN?.trim();
const finalToken = rawToken?.startsWith('Bearer ') ? rawToken.substring(7).trim() : rawToken;

const client = createClient({
  url: (process.env.DATABASE_URL || 'file:local.db').trim(),
  authToken: finalToken,
});

export const db = drizzle(client, { schema });
