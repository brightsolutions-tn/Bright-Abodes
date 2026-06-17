import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!.trim(),
    authToken: process.env.DATABASE_AUTH_TOKEN!.trim().startsWith('Bearer ') 
      ? process.env.DATABASE_AUTH_TOKEN!.trim().substring(7).trim() 
      : process.env.DATABASE_AUTH_TOKEN!.trim(),
  },
});
