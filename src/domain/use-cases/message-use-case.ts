import { MessageProtocol, MessageServiceFactory } from '../../infrastructure/messaging/message-service-factory';
import { IMessageUseCase } from '../interfaces/use-cases/message-use-case';
import { MessageRepository } from '../repositories/message-repository';
import { Message } from '@/domain/entities/message';

export class MessageUseCaseImpl implements IMessageUseCase {
  messageRepository: MessageRepository;
  messageServiceFactory: MessageServiceFactory;

  constructor(messageRepository: MessageRepository, messageServiceFactory: MessageServiceFactory) {
    this.messageRepository = messageRepository;
    this.messageServiceFactory = messageServiceFactory;
  }

  async getChannelMessages(channelId: string): Promise<Message[] | null> {
    try {
      const messages = this.messageRepository.getChannelMessages(channelId);
      return messages;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendMessage(message: Omit<Message, 'id'>, _protocol: MessageProtocol = MessageProtocol.SOCKET): Promise<void> {
    try {
      const messageService = this.messageServiceFactory.getService(MessageProtocol.KAFKA);
      await messageService.sendMessage({
        channelId: message.channelId,
        sender: message.sender,
        contents: message.contents,
        taggedMessage: message.taggedMessage,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async loadMoreChannelMessages(channelId: string, offset: number, limit: number) {
    try {
      const moreMessages = this.messageRepository.loadMoreChannelMessages(channelId, offset, limit);
      return moreMessages;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
