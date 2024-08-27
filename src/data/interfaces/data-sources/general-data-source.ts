import { LoginResponseModel, User } from "@/domain/entities/auth";
import { Message as MessageRequest } from "@/domain/entities/message";
import Message from "@/data/models/message";
import { Channel } from "@/domain/entities/channel";

export interface IGeneralDataSource {
  getAllUsers(): Promise<User[] | null>;
  createOrUpdateUser(uid: string, name: string, email: string): Promise<User | null>;
  updateUser(uid: string, name: string, email: string): Promise<User | null>;
  getUserById(uid: string): Promise<LoginResponseModel | null>;
  createUser(name: string, email: string): Promise<User | null>;

  sendMessage(message: MessageRequest): Promise<void>;
  getChannelMessages(channelId: string): Promise<Message[] | null>;

  getAllChannels(): Promise<Channel[] | null>;
  createChannel(name: string): Promise<Channel[] | null>;
  deleteChannel(channelId: string): Promise<void>;
}
