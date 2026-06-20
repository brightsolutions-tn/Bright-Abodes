import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: (process.env.DATABASE_URL || 'file:local.db').trim(),
    authToken: (process.env.DATABASE_AUTH_TOKEN || 'dummy').trim().startsWith('Bearer ') 
      ? (process.env.DATABASE_AUTH_TOKEN || 'dummy').trim().substring(7).trim() 
      : (process.env.DATABASE_AUTH_TOKEN || 'dummy').trim(),
  },
});
