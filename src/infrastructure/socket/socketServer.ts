import { Server } from 'socket.io';
import Message from '@/data/models/message';
import { Channel } from '@/domain/entities/channel';
import { MessagesRequest } from '@/domain/entities/message';
import { ChannelRepository } from '@/domain/repositories/channel-repository';
import { MessageRepository } from '@/domain/repositories/message-repository';
import type {
  DeleteSocketRequest,
  SocketMessageData,
  CreateChannelRequest,
  DeleteChannelRequest,
} from '@/infrastructure/socket/types';

export class SocketServer {
  private io: Server;
  private messageRepository: MessageRepository;
  private channelRepository: ChannelRepository;

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

  public initialize(): void {
    this.io.on('connection', (socket) => {
      socket.on('join', async () => {
        const channels: Channel[] | null = await this.emitChannels();
        const latestChannel: Channel = (channels || [])[0];

        socket.join(latestChannel.id);
        await this.emitChannelMessages(latestChannel.id);
      });

      socket.on('joinChannel', async (channelId) => {
        const messages: Message[] | null = await this.getAllChannelMessages({ channelId });
        this.io.emit('channelMessages', { messages, channelId });
      });

      socket.on('requestChannelMessages', async (channelId: string) => {
        await this.emitChannelMessages(channelId);
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

      socket.on('getChannels', async () => {
        await this.emitChannels();
      });

      socket.on('createChannel', async (data: CreateChannelRequest) => {
        await this.createChannel(data);
        const channels = await this.getAllChannels();
        this.io.emit('channels', channels);
      });

      socket.on('deleteChannel', async (data: DeleteChannelRequest) => {
        await this.channelRepository.deleteChannel(data.channelId);
        const channels = await this.getAllChannels();
        this.io.emit('channels', channels);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnect');
      });
    });
  }

  private async emitChannelMessages(channelId: string) {
    const messages = await this.getAllChannelMessages({ channelId });
    this.io.to(channelId).emit('channelMessages', { messages, channelId });
  }

  private async emitChannels(): Promise<Channel[] | null> {
    const channels = await this.getAllChannels();
    this.io.emit('channels', channels);
    return channels;
  }

  private async getAllChannelMessages(data: MessagesRequest) {
    const messages = await this.messageRepository.getChannelMessages(data.channelId);
    return messages;
  }

  private async sendMessage(data: SocketMessageData) {
    const timestamp = new Date();
    await this.messageRepository.send({
      ...data,
      timestamp,
    });
  }

  private async deleteMessage(data: DeleteSocketRequest) {
    await this.messageRepository.deleteMessage(data.channelId, data.sender);
  }

  private async getAllChannels() {
    return await this.channelRepository.getAllChannels();
  }

  private async createChannel(data: CreateChannelRequest) {
    return await this.channelRepository.createChannel(data.name);
  }

  public emitMessage(channelId: string, sender: string, content: string): void {
    const data = { channelId, sender, content };
    this.io.to(channelId).emit('message', data);
  }
}
