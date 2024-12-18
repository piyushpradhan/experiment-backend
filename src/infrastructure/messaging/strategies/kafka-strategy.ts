import { KafkaConsumerGroups, KafkaTopics } from '../../../data/data-sources/kafka/config';
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
import { EventEmitter } from 'events';

export class KafkaMessagingService implements MessageService {
  private eventEmitter: EventEmitter;
  constructor(
    private kafkaClient: KafkaWrapper,
    private messageRepository: MessageRepository,
    private channelReposiory: ChannelRepository,
  ) {
    this.eventEmitter = new EventEmitter();
  }

  getEventEmitter(): EventEmitter {
    return this.eventEmitter;
  }

  private async startListeningForMessages(): Promise<void> {
    try {
      // Listen for new messages
      await this.kafkaClient.consume(KafkaTopics.MESSAGE_SENT, KafkaConsumerGroups.MESSAGE_EVENTS, async (message) => {
        if (message.value) {
          const parsedMessage = JSON.parse(message.value) as SocketMessageData;

          const messages = await this.messageRepository.getChannelMessages(parsedMessage.channelId);

          // Send to all clients
          this.eventEmitter.emit('newMessage', { messages, channelId: parsedMessage.channelId });
        }
      });

      // Listen for deleted messages
      await this.kafkaClient.consume(KafkaTopics.MESSAGE_DELETED, KafkaConsumerGroups.MESSAGE_EVENTS, async (message) => {
        if (message.value) {
          const { messageId, channelId } = JSON.parse(message.value);
          await this.messageRepository.deleteMessage(channelId, messageId);

          const messages = await this.messageRepository.getChannelMessages(channelId);
          this.eventEmitter.emit('newMessage', { messages, channelId: channelId });
        }
      });

      // Listen for new channels
      await this.kafkaClient.consume(KafkaTopics.CHANNEL_CREATED, KafkaConsumerGroups.CHANNEL_EVENTS, async (message) => {
        if (message.value) {
          const { name } = JSON.parse(message.value);
          await this.channelReposiory.createChannel(name);
        }
      });

      // Listen for deleted channels
      await this.kafkaClient.consume(KafkaTopics.CHANNEL_DELETED, KafkaConsumerGroups.CHANNEL_EVENTS, async (message) => {
        if (message.value) {
          const { channelId } = JSON.parse(message.value);
          await this.channelReposiory.deleteChannel(channelId);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

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

  async getChannelMessages(channelId: string): Promise<void> {
    const messages = await this.messageRepository.getChannelMessages(channelId);
    await this.kafkaClient.produce(KafkaTopics.CHANNEL_MESSAGES, [
      {
        key: channelId,
        value: JSON.stringify({ messages, channelId }),
      },
    ]);
  }

  async loadMoreMessages(data: LoadMoreMessagesRequest): Promise<Message[] | null> {
    return await this.messageRepository.loadMoreChannelMessages(data.channelId, data.offset, data.limit);
  }

  async getSingleMessage(data: SingleMessageDetailRequest): Promise<Message | null> {
    return await this.messageRepository.getMessageDetails(data.messageId);
  }

  async getAllChannels(): Promise<Channel[] | null> {
    return await this.channelReposiory.getAllChannels();
  }

  async createChannel(data: CreateChannelRequest): Promise<Channel[] | null> {
    await this.kafkaClient.produce(KafkaTopics.CHANNEL_CREATED, [
      {
        key: data.name,
        value: JSON.stringify({
          name: data.name,
        }),
      },
    ]);

    return await this.channelReposiory.createChannel(data.name);
  }

  async deleteChannel(data: DeleteChannelRequest): Promise<void> {
    await this.kafkaClient.produce(KafkaTopics.CHANNEL_DELETED, [
      {
        key: data.channelId,
        value: JSON.stringify({
          channelId: data.channelId,
        }),
      },
    ]);

    await this.channelReposiory.deleteChannel(data.channelId);
  }

  async disconnect(): Promise<void> {
    await this.kafkaClient.disconnect();
  }

  async initialize(): Promise<void> {
    await this.kafkaClient.connect();
    await this.startListeningForMessages();
  }

  async sendMessage(data: SocketMessageData): Promise<void> {
    const timestamp = new Date();

    await this.messageRepository.send({
      ...data,
      timestamp,
    });

    await this.kafkaClient.produce(KafkaTopics.MESSAGE_SENT, [
      {
        key: data.channelId,
        value: JSON.stringify({
          ...data,
          timestamp,
        }),
      },
    ]);
  }
}
