import { createClient } from '@libsql/client';

async function checkConnection() {
  console.log('Testing Turso connection...');
  const url = (process.env.DATABASE_URL || '').trim();
  const token = (process.env.DATABASE_AUTH_TOKEN || '').trim();

  console.log('DATABASE_URL is set:', !!url);
  if (url) {
    console.log('DATABASE_URL protocol:', url.split('://')[0] + '://');
    console.log('DATABASE_URL length:', url.length);
  }
  console.log('DATABASE_AUTH_TOKEN is set:', !!token);
  console.log('DATABASE_AUTH_TOKEN length:', token.length);

  const client = createClient({
    url,
    authToken: token,
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
