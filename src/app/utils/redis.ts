
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.NEXT_PUBLIC_REDIS_HOST,     
  port: Number(process.env.NEXT_PUBLIC_REDIS_PORT),                  
  password: process.env.NEXT_PUBLIC_REDIS_PASSWORD
});

redis.on('connect', () => {
    console.log('Redis connected successfully');
  });
  

  redis.on('ready', () => {
    console.log('Redis is ready to accept commands');
  });
  

  redis.on('error', (error) => {
    console.error('Error connecting to Redis:', error);
  });
  

  redis.on('close', () => {
    console.log('Redis connection closed');
  });
  
export default redis;
