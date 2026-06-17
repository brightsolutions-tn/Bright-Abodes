import { createClient } from '@libsql/client';

async function checkConnection() {
  console.log('Testing Turso connection...');
  console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL);
  console.log('DATABASE_AUTH_TOKEN is set:', !!process.env.DATABASE_AUTH_TOKEN);

  const client = createClient({
    url: (process.env.DATABASE_URL || '').trim(),
    authToken: process.env.DATABASE_AUTH_TOKEN?.trim() || '',
  });

  try {
    const result = await client.execute('SELECT 1 as check_val');
    console.log('Connection successful!');
    console.log('Result:', JSON.stringify(result.rows));
  } catch (error) {
    console.error('Connection failed!');
    console.error('Error details:', error);
    process.exit(1);
  }
}

checkConnection();
