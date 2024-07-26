import { PGDataSource } from "@/data/data-sources/postgres/postgres-general-data-source";
import { IMessageRepository } from "../interfaces/repositories/message-repository";
import { Message as CreateMessageRequest } from "../entities/message";
import Message from "@/data/models/message";

export class MessageRepository implements IMessageRepository {
  pgDataSource: PGDataSource;
  constructor(pgDataSource: PGDataSource) {
    this.pgDataSource = pgDataSource;
  }

  async send(message: Omit<CreateMessageRequest, "id">): Promise<void> {
    await this.pgDataSource.sendMessage(message);
  }

  async getChannelMessages(channelId: string): Promise<Message[] | null> {
    return this.pgDataSource.getChannelMessages(channelId);
  }

  getByChannelId(channelId: string): Promise<Message[]> {
    throw new Error("Method not implemented.");
  }

  async deleteMessage(channelId: string, sender: string): Promise<void> {
    await this.pgDataSource.deleteMessage(channelId, sender);
  }
}
