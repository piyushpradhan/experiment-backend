import { Channel } from '@/domain/entities/channel';
import { LoadMoreMessagesRequest, Message } from '@/domain/entities/message';
import {
  CreateChannelRequest,
  DeleteChannelRequest,
  DeleteSocketRequest,
  SingleMessageDetailRequest,
  SocketMessageData,
} from '@/infrastructure/socket/types';

export interface MessageService {
  initialize(): void;
  sendMessage(data: SocketMessageData): Promise<void>;
  deleteMessage(data: DeleteSocketRequest): Promise<void>;
  getChannelMessages(channelId: string): Promise<void>;
  loadMoreMessages(data: LoadMoreMessagesRequest): Promise<Message[] | null>;
  getSingleMessage(data: SingleMessageDetailRequest): Promise<Message | null>;
  getAllChannels(): Promise<Channel[] | null>;
  createChannel(data: CreateChannelRequest): Promise<Channel[] | null>;
  deleteChannel(data: DeleteChannelRequest): Promise<void>;
  disconnect(): Promise<void>;
}
