import { PGDataSource } from "@/data/data-sources/postgres/postgres-general-data-source";
import { IMessageRepository } from "../interfaces/repositories/message-repository";
import { Message as CreateMessageRequest } from "../entities/message";
import Message from "@/data/models/message";
import { RedisDatabaseWrapper } from "@/data/interfaces/data-sources/redis-wrapper";

export class MessageRepository implements IMessageRepository {
  pgDataSource: PGDataSource;
  redisDataSource: RedisDatabaseWrapper;

  constructor(pgDataSource: PGDataSource, redisDataSource: RedisDatabaseWrapper) {
    this.pgDataSource = pgDataSource;
    this.redisDataSource = redisDataSource;
  }

  async send(message: Omit<CreateMessageRequest, "id">): Promise<void> {
    await this.pgDataSource.sendMessage(message);

    // Invalidate the Redis cache for the relevant channel's messages
    const cacheKey = `channel:messages:${message.channelId}`;
    const channelListKey = "channels:list";
    await this.redisDataSource.del(channelListKey);
    await this.redisDataSource.del(cacheKey);
  }

  async getChannelMessages(channelId: string): Promise<Message[] | null> {
    const cacheKey = `channel:messages:${channelId}`;

    // Try to retrieve messages from Redis cache
    const cachedMessages = await this.redisDataSource.get(cacheKey);
    if (cachedMessages) {
      return JSON.parse(cachedMessages) as Message[];
    }

    // If not present in cache, get messages from Postgres database
    const messages = await this.pgDataSource.getChannelMessages(channelId);

    // Cache the messages in Redis
    if (messages) {
      await this.redisDataSource.set(cacheKey, JSON.stringify(messages), { EX: 60 })
    }

    return messages;
  }

  async deleteMessage(channelId: string, sender: string): Promise<void> {
    await this.pgDataSource.deleteMessage(channelId, sender);
  }
}
