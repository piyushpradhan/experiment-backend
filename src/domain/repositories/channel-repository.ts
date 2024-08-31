import { Channel } from '@/domain/entities/channel';
import { IChannelRepository } from '../interfaces/repositories/channel-repository';
import { PGDataSource } from '@/data/data-sources/postgres/postgres-general-data-source';
import { RedisDatabaseWrapper } from '@/data/interfaces/data-sources/redis-wrapper';

export class ChannelRepository implements IChannelRepository {
  pgDataSource: PGDataSource;
  redisDataSource: RedisDatabaseWrapper;

  constructor(pgDataSource: PGDataSource, redisDataSource: RedisDatabaseWrapper) {
    this.pgDataSource = pgDataSource;
    this.redisDataSource = redisDataSource;
  }

  async createChannel(name: string): Promise<Channel[] | null> {
    const result = await this.pgDataSource.createChannel(name);

    // Invalidate the Redis cache for channel list
    const cacheKey = 'channels';
    await this.redisDataSource.del(cacheKey);

    return result;
  }

  async deleteChannel(channelId: string): Promise<void> {
    await this.pgDataSource.deleteChannel(channelId);

    // Invalidate the Redis cache for the channel list
    const cacheKey = 'channels';
    await this.redisDataSource.del(cacheKey);
  }

  async getAllChannels(): Promise<Channel[] | null> {
    const cacheKey = 'channels';

    // Try to retrieve the channels from Redis cache
    const cachedChannels = await this.redisDataSource.hGetAll(cacheKey);

    if (cachedChannels && Object.values(cachedChannels).length > 0) {
      return Object.values(cachedChannels)
        .map((channel) => JSON.parse(channel))
        .sort((a: Channel, b: Channel) => {
          if (a.updated_at < b.updated_at) return 1;
          if (a.updated_at > b.updated_at) return -1;
          return 0;
        }) as Channel[];
    }

    // If not cached, retrieve channels from PostgreSQL
    const channels = await this.pgDataSource.getAllChannels();

    // Cache the channels in redis
    if (channels) {
      for (const channel of channels) {
        await this.redisDataSource.hSet(cacheKey, channel.id, JSON.stringify(channel));
        await this.redisDataSource.expire(cacheKey, 3000);
      }
    }

    return channels;
  }
}
