const redis = require('redis');

// Create a Redis client
const client = redis.createClient();

// Handle connection errors
client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis
client.on('connect', () => {
  console.log('Connected to Redis');
});

// Use the client for operations
client.set('key', 'value', (err, reply) => {
  if (err) console.error(err);
  console.log('Set key response:', reply);
});

client.get('key', (err, reply) => {
  if (err) console.error(err);
  console.log('Get key response:', reply);
});
