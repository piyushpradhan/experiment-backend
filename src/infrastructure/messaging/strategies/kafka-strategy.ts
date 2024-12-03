import { KafkaTopics, MessageEvent } from '@/data/data-sources/kafka/config';
import { KafkaWrapper } from '@/data/interfaces/data-sources/kafka-wrapper';
import { Channel } from '@/domain/entities/channel';
import { LoadMoreMessagesRequest, Message } from '@/domain/entities/message';
import { ChannelRepository } from '@/domain/repositories/channel-repository';
import { MessageRepository } from '@/domain/repositories/message-repository';
import { MessageService } from '@/infrastructure/messaging/message-service';
import {
  CreateChannelRequest,
  DeleteChannelRequest,
  DeleteSocketRequest,
  SingleMessageDetailRequest,
  SocketMessageData,
} from '@/infrastructure/socket/types';

export class KafkaMessagingService implements MessageService {
  constructor(
    private kafkaClient: KafkaWrapper,
    private messageRepository: MessageRepository,
    private channelReposiory: ChannelRepository,
  ) {}

  async deleteMessage(data: DeleteSocketRequest): Promise<void> {
    await this.kafkaClient.produce(KafkaTopics.MESSAGE_DELETED, [
      {
        key: data.channelId,
        value: JSON.stringify({
          messageId: data.sender,
        }),
      },
    ]);
    await this.messageRepository.deleteMessage(data.channelId, data.sender);
  }
  getChannelMessages(channelId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  loadMoreMessages(data: LoadMoreMessagesRequest): Promise<Message[] | null> {
    throw new Error('Method not implemented.');
  }
  getSingleMessage(data: SingleMessageDetailRequest): Promise<Message | null> {
    throw new Error('Method not implemented.');
  }
  getAllChannels(): Promise<Channel[] | null> {
    throw new Error('Method not implemented.');
  }
  createChannel(data: CreateChannelRequest): Promise<Channel[] | null> {
    throw new Error('Method not implemented.');
  }
  deleteChannel(data: DeleteChannelRequest): Promise<void> {
    throw new Error('Method not implemented.');
  }
  disconnect(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async initialize(): Promise<void> {
    await this.kafkaClient.connect();
  }

  async sendMessage(data: SocketMessageData): Promise<void> {
    const timestamp = new Date();

    await this.kafkaClient.produce(KafkaTopics.MESSAGE_SENT, [
      {
        key: data.channelId,
        value: JSON.stringify({
          ...data,
          timestamp,
        }),
      },
    ]);

    await this.messageRepository.send({
      ...data,
      timestamp,
    });
  }
}
