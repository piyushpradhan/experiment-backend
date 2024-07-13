import { PGDataSource } from "@/data/data-sources/postgres/postgres-general-data-source";
import { IMessageRepository } from "../interfaces/repositories/message-repository";
import { Message } from "../entities/message";

export class MessageRepository implements IMessageRepository {
  pgDataSource: PGDataSource;
  constructor(pgDataSource: PGDataSource) {
    this.pgDataSource = pgDataSource;
  }

  async send(message: Omit<Message, "id">): Promise<void> {
    console.log("Sending a message works");
  }
  getByChannelId(channelId: string): Promise<Message[]> {
    throw new Error("Method not implemented.");
  }
}
