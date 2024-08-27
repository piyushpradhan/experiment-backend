import { Message as CreateMessageRequest } from "@/domain/entities/message";
import Message from "@/data/models/message";

export interface IMessageRepository {
  send(message: Omit<CreateMessageRequest, "id">): Promise<void>;
  getChannelMessages(channelId: string): Promise<Message[] | null>;
  deleteMessage(channelId: string, sender: string): Promise<void>;
}
