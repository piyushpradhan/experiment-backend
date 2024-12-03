import { KafkaWrapper } from '@/data/interfaces/data-sources/kafka-wrapper';
import { ChannelRepository } from '@/domain/repositories/channel-repository';
import { MessageRepository } from '@/domain/repositories/message-repository';
import { SocketMessagingService } from './strategies/socket-strategy';
import { KafkaMessagingService } from './strategies/kafka-strategy';
import { MessageService } from '@/infrastructure/messaging/message-service';

export enum MessageProtocol {
  SOCKET = 'socket',
  KAFKA = 'kafka',
}

export class MessageServiceFactory {
  private services: Map<MessageProtocol, MessageService>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server: any,
    messageRepository: MessageRepository,
    channelRepository: ChannelRepository,
    kafkaClient: KafkaWrapper,
  ) {
    this.services = new Map();

    // Initialize services at startup
    const socketService = new SocketMessagingService(server, messageRepository, channelRepository);
    const kafkaService = new KafkaMessagingService(kafkaClient, messageRepository, channelRepository);

    this.services.set(MessageProtocol.SOCKET, socketService);
    this.services.set(MessageProtocol.KAFKA, kafkaService);

    this.services.forEach((service) => service.initialize());
  }

  getService(protocol: MessageProtocol): MessageService {
    const service = this.services.get(protocol);
    if (!service) {
      throw new Error(`Unsupported protocol: ${protocol}`);
    }

    return service;
  }
}
