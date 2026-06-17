import { createClient } from '@libsql/client';

async function checkConnection() {
  console.log('Testing Turso connection...');
  const url = (process.env.DATABASE_URL || '').trim();
  const rawToken = (process.env.DATABASE_AUTH_TOKEN || '').trim();
  const token = rawToken.startsWith('Bearer ') ? rawToken.substring(7).trim() : rawToken;

  console.log('DATABASE_URL is set:', !!url);
  if (url) {
    console.log('DATABASE_URL protocol:', url.split('://')[0] + '://');
    console.log('DATABASE_URL length:', url.length);
  }
  console.log('DATABASE_AUTH_TOKEN is set:', !!rawToken);
  console.log('DATABASE_AUTH_TOKEN length:', rawToken.length);
  if (rawToken.startsWith('Bearer ')) {
    console.log('DATABASE_AUTH_TOKEN starts with "Bearer " - stripping it.');
  }

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
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      // Log any other properties
      console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    } else {
      console.error('Unknown error:', error);
    }
    process.exit(1);
  }
}

checkConnection();
