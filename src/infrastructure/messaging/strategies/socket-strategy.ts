import { Server } from 'socket.io';
import { Channel } from '@/domain/entities/channel';
import { LoadMoreMessagesRequest, MessagesRequest, Message } from '@/domain/entities/message';
import { ChannelRepository } from '@/domain/repositories/channel-repository';
import { MessageRepository } from '@/domain/repositories/message-repository';
import type {
  DeleteSocketRequest,
  SocketMessageData,
  CreateChannelRequest,
  DeleteChannelRequest,
  SingleMessageDetailRequest,
} from '@/infrastructure/socket/types';
import { MessageService } from '@/infrastructure/messaging/message-service';

export class SocketMessagingService implements MessageService {
  io: Server;
  messageRepository: MessageRepository;
  channelRepository: ChannelRepository;

  constructor(server: any, repository: MessageRepository, channelRepository: ChannelRepository) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });
    this.messageRepository = repository;
    this.channelRepository = channelRepository;

    this.initialize();
  }

  initialize(): void {
    this.io.on('connection', (socket) => {
      socket.on('join', async () => {
        const channels: Channel[] | null = await this.emitChannels();
        const latestChannel: Channel = (channels || [])[0];

        if (latestChannel) {
          socket.join(latestChannel.id);
          await this.getChannelMessages(latestChannel.id);
        }
      });

      socket.on('joinChannel', async (channelId) => {
        const messages: Message[] | null = await this.getAllChannelMessages({ channelId });
        this.io.emit('channelMessages', { messages, channelId });
      });

      socket.on('requestChannelMessages', async (channelId: string) => {
        await this.getChannelMessages(channelId);
      });

      socket.on('loadMoreMessages', async (data: LoadMoreMessagesRequest) => {
        const messages = await this.loadMoreMessages(data);
        this.io.emit('moreChannelMessages', { messages, channelId: data.channelId });
      });

      socket.on('message', async (data: SocketMessageData) => {
        await this.sendMessage(data);
        const messages = await this.getAllChannelMessages({ channelId: data.channelId });
        this.io.emit('channelMessages', { messages, channelId: data.channelId });
      });

      socket.on('deleteMessage', async (data: DeleteSocketRequest) => {
        await this.deleteMessage(data);
        const messages = await this.getAllChannelMessages({ channelId: data.channelId });
        this.io.to(data.channelId).emit('channelMessages', { messages, channelId: data.channelId });
      });

      socket.on('requestSingleMessage', async (messageId: string) => {
        const message = await this.getSingleMessage({ messageId });
        this.io.emit('singleMessage', message);
      });

      socket.on('getChannels', async () => {
        await this.emitChannels();
      });

      socket.on('createChannel', async (data: CreateChannelRequest) => {
        await this.createChannel(data);
        const channels = await this.getAllChannels();
        this.io.emit('channels', channels);
      });

      socket.on('deleteChannel', async (data: DeleteChannelRequest) => {
        this.deleteChannel(data);
      });

      socket.on('disconnect', () => {
        this.disconnect();
      });
    });
  }

  async getChannelMessages(channelId: string) {
    const messages = await this.getAllChannelMessages({ channelId });
    this.io.to(channelId).emit('channelMessages', { messages, channelId });
  }

  async emitChannels(): Promise<Channel[] | null> {
    const channels = await this.getAllChannels();
    this.io.emit('channels', channels);
    return channels;
  }

  async getAllChannelMessages(data: MessagesRequest) {
    const messages = await this.messageRepository.getChannelMessages(data.channelId);
    return messages;
  }

  async loadMoreMessages(data: LoadMoreMessagesRequest) {
    const messages = await this.messageRepository.loadMoreChannelMessages(data.channelId, data.offset, data.limit);
    return messages;
  }

  async sendMessage(data: SocketMessageData) {
    const timestamp = new Date();
    await this.messageRepository.send({
      ...data,
      timestamp,
    });
  }

  async deleteMessage(data: DeleteSocketRequest) {
    await this.messageRepository.deleteMessage(data.channelId, data.sender);
  }

  async getSingleMessage(data: SingleMessageDetailRequest) {
    const messageDetails = await this.messageRepository.getMessageDetails(data.messageId);
    return messageDetails;
  }

  async getAllChannels() {
    return await this.channelRepository.getAllChannels();
  }

  async createChannel(data: CreateChannelRequest) {
    return await this.channelRepository.createChannel(data.name);
  }

  async deleteChannel(data: DeleteChannelRequest) {
    await this.channelRepository.deleteChannel(data.channelId);
    const channels = await this.getAllChannels();
    this.io.emit('channels', channels);
  }

  emitMessage(channelId: string, sender: string, content: string): void {
    const data = { channelId, sender, content };
    this.io.to(channelId).emit('message', data);
  }

  async disconnect() {
    console.log('disconnect');
  }
}
