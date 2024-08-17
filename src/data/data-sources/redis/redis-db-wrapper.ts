import { RedisDatabaseWrapper } from '@/data/interfaces/data-sources/redis-wrapper';
import { createClient, RedisClientType } from 'redis';

export class RedisDatabaseWrapperImpl implements RedisDatabaseWrapper {
  private client: RedisClientType;

  constructor() {
    this.client = createClient();
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
  async quit(): Promise<void> {
    await this.client.quit();
  }
}
