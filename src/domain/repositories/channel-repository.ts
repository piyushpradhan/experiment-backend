import { Channel } from "@/domain/entities/channel";
import { IChannelRepository } from "../interfaces/repositories/channel-repository";
import { PGDataSource } from "@/data/data-sources/postgres/postgres-general-data-source";
import { RedisDatabaseWrapper } from "@/data/interfaces/data-sources/redis-wrapper";

export class ChannelRepository implements IChannelRepository {
  pgDataSource: PGDataSource;
  redisDataSource: RedisDatabaseWrapper;

  constructor(pgDataSource: PGDataSource, redisDataSource: RedisDatabaseWrapper) {
    this.pgDataSource = pgDataSource;
    this.redisDataSource = redisDataSource
  }

  async createChannel(name: string): Promise<Channel[] | null> {
    const result = await this.pgDataSource.createChannel(name);

    // Invalidate the Redis cache for channel list
    const cacheKey = "channels:list";
    await this.redisDataSource.del(cacheKey);

    return result;
  }

  async deleteChannel(channelId: string): Promise<void> {
    await this.pgDataSource.deleteChannel(channelId);

    // Invalidate the Redis cache for the channel list
    const cacheKey = "channels:list";
    await this.redisDataSource.del(cacheKey);
  }

  async getAllChannels(): Promise<Channel[] | null> {
    const cacheKey = "channels:list";

    // Try to retrieve the channels from Redis cache
    const cachedChannels = await this.redisDataSource.get(cacheKey);
    if (cachedChannels) {
      return JSON.parse(cachedChannels) as Channel[];
    }

    // If not cached, retrieve channels from PostgreSQL
    const channels = await this.pgDataSource.getAllChannels();

    // Cache the channels in redis
    if (channels) {
      // Cache for 5 minutes
      for (const channel of channels) {
        await this.redisDataSource.set(cacheKey, JSON.stringify(channels), { EX: 300 });
      }
    }

    return channels;
  }
}
