import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

client.on('error', err => console.log('Redsi client not connected to the server', err));

client.on('connect', () => console.log('Redis client connected to the server'));

function setNewSchool(schoolName, value) {
    client.set(schoolName, value, redis.print);
}

const getAsync = promisify(client.get).bind(client);

async function displaySchoolValue(schoolName) {
    try {
        const reply = await getAsync(schoolName);
        console.log(reply);
    } catch (err) {
        console.error(err.message);
    }
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');