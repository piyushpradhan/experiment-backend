import { Message } from "@/domain/entities/message";

export interface IMessageRepository {
  send(message: Omit<Message, "id">): Promise<void>;
  getByChannelId(channelId: string): Promise<Message[]>;
}
