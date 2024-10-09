import { LoginResponseModel, User } from '@/domain/entities/auth';
import { Message } from '@/domain/entities/message';
import { Channel } from '@/domain/entities/channel';

export interface IGeneralDataSource {
  getAllUsers(): Promise<User[] | null>;
  createOrUpdateUser(uid: string, name: string, email: string): Promise<User | null>;
  updateUser(uid: string, name: string, email: string): Promise<User | null>;
  getUserById(uid: string): Promise<LoginResponseModel | null>;
  createUser(name: string, email: string): Promise<User | null>;

  sendMessage(message: Message): Promise<void>;
  getChannelMessages(channelId: string): Promise<Message[] | null>;
  loadMoreMessages(channelId: string, offset: number, limit: number): Promise<Message[] | null>;

  getAllChannels(): Promise<Channel[] | null>;
  createChannel(name: string): Promise<Channel[] | null>;
  deleteChannel(channelId: string): Promise<void>;
}
