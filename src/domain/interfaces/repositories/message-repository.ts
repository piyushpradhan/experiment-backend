import { Message } from '@/domain/entities/message';

export interface IMessageRepository {
  send(message: Omit<Message, 'id'>): Promise<void>;
  getChannelMessages(channelId: string): Promise<Message[] | null>;
  deleteMessage(channelId: string, sender: string): Promise<void>;
}
