import { Message } from '@/domain/entities/message';
import { MessageProtocol } from '@/infrastructure/messaging/message-service-factory';

export interface IMessageUseCase {
  sendMessage(message: Omit<Message, 'id'>, protocol?: MessageProtocol): Promise<void>;
  getChannelMessages(channelId: string): Promise<Message[] | null>;
  loadMoreChannelMessages(channelId: string, offset: number, limit: number): Promise<Message[] | null>;
}
