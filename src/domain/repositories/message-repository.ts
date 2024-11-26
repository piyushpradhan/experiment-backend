import { PGDataSource } from '@/data/data-sources/postgres/postgres-general-data-source';
import { IMessageRepository } from '../interfaces/repositories/message-repository';
import { Message } from '@/domain/entities/message';
import { Channel } from '@/domain/entities/channel';
import { RedisDatabaseWrapper } from '@/data/interfaces/data-sources/redis-wrapper';
import { redisConfig } from '../../data/data-sources/redis/config';

export class MessageRepository implements IMessageRepository {
  pgDataSource: PGDataSource;
  redisDataSource: RedisDatabaseWrapper;

  constructor(pgDataSource: PGDataSource, redisDataSource: RedisDatabaseWrapper) {
    this.pgDataSource = pgDataSource;
    this.redisDataSource = redisDataSource;
  }

  async send(message: Omit<Message, 'id'>): Promise<void> {
    await this.pgDataSource.sendMessage(message);

    // Invalidate the Redis cache for the relevant channel's messages
    const cacheKey = `channel:messages:${message.channelId}`;

    // Update the last message of the channel
    const channelDetailStringified = await this.redisDataSource.hGet('channels', message.channelId);
    if (channelDetailStringified) {
      const parsedChannelDetails = JSON.parse(channelDetailStringified) as Channel;
      parsedChannelDetails.last_message = message.contents;
      parsedChannelDetails.updated_at = message.timestamp;
      this.redisDataSource.hSet('channels', message.channelId, JSON.stringify(parsedChannelDetails));
    }

    // await this.redisDataSource.hSet('channels', message.channelId);
    await this.redisDataSource.del(cacheKey);
  }

  async getChannelMessages(channelId: string): Promise<Message[] | null> {
    const cacheKey = await this.redisDataSource.getCacheKey('channelMessages', channelId);

    const cachedMessages = await this.redisDataSource.get(cacheKey);
    if (cachedMessages) {
      return JSON.parse(cachedMessages) as Message[];
    }

    const messages = await this.pgDataSource.getChannelMessages(channelId);

    if (messages) {
      await this.redisDataSource.setWithTTL(cacheKey, JSON.stringify(messages), redisConfig.ttl.messages);
    }

    return messages;
  }

  async loadMoreChannelMessages(channelId: string, offset: number, limit: number): Promise<Message[] | null> {
    const messages = await this.pgDataSource.loadMoreMessages(channelId, offset, limit);
    return messages;
  }

  async deleteMessage(channelId: string, sender: string): Promise<void> {
    await this.pgDataSource.deleteMessage(channelId, sender);
  }

  async getMessageDetails(messageId: string): Promise<Message | null> {
    return await this.pgDataSource.getMessageDetails(messageId);
  }
}
