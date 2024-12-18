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

  async sendMessage(message: Omit<Message, 'id'>, protocol: MessageProtocol = MessageProtocol.SOCKET): Promise<void> {
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
}
