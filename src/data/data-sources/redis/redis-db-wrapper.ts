import { RedisDatabaseWrapper } from '@/data/interfaces/data-sources/redis-wrapper';
import { createClient, RedisClientType } from 'redis';

const redisUrl = process.env.REDIS_URL;

export class RedisDatabaseWrapperImpl implements RedisDatabaseWrapper {
  private client: RedisClientType;

  constructor() {
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }

    this.client = createClient({ url: redisUrl });
    this.client.connect();

    this.client.on('error', (err) => {
      console.error('Redis error: ', err);
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      console.error(`Redis GET error: ${err}`);
      return null;
    }
  }
  async set(key: string, value: string, options?: { EX?: number }): Promise<void> {
    try {
      if (options?.EX) {
        await this.client.set(key, value, { EX: options.EX });
      } else {
        await this.client.set(key, value);
      }
    } catch (err) {
      console.error(`Redis GET error: ${err}`);
    }
  }
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error(`Redis DEL error: ${err}`);
    }
  }
  async keys(pattern: string): Promise<Array<string> | null> {
    try {
      const keys = await this.client.keys(pattern);
      return keys;
    } catch (err) {
      console.error(`Redis KEYS error: ${err}`);
      return null;
    }
  }
  async hGetAll(key: string): Promise<{ [key: string]: string } | null> {
    try {
      const values = await this.client.hGetAll(key);
      return values;
    } catch (err) {
      console.error(`Redis HGETALL error: ${err}`);
      return null;
    }
  }
  async hKeys(cacheKey: string): Promise<Array<string> | null> {
    try {
      const keys = await this.client.hKeys(cacheKey);
      return keys;
    } catch (err) {
      console.error(`Redis HKEYS error: ${err}`);
      return null;
    }
  }
  async hGet(cacheKey: string, field: string): Promise<string | undefined | null> {
    try {
      const hashValue = await this.client.hGet(cacheKey, field);
      return hashValue;
    } catch (err) {
      console.error(`Redis HGET error: ${err}`);
      return null;
    }
  }
  async hSet(hashKey: string, field: string, value: any): Promise<number | null> {
    try {
      return await this.client.hSet(hashKey, field, value);
    } catch (err) {
      console.error(`Redis HSET error: ${err}`);
      return null;
    }
  }
  async hDel(hashKey: string, field: string): Promise<void> {
    try {
      await this.client.hDel(hashKey, field);
    } catch (err) {
      console.error(`Redis HDEL error: ${err}`);
    }
  }
  async multi(): Promise<any> {
    try {
      return this.client.multi();
    } catch (err) {
      console.error(`Redis MULTI error: ${err}`);
      return null;
    }
  }
  async quit(): Promise<void> {
    await this.client.quit();
  }
  async expire(cacheKey: string, time: number): Promise<void> {
    try {
      await this.client.expire(cacheKey, time);
    } catch (err) {
      console.error(`Redis expire error: ${err}`);
    }
  }
}
