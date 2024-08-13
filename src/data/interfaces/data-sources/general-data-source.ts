import { LoginResponseModel } from "@/domain/entities/auth";
import { Message as MessageRequest } from "@/domain/entities/message";
import { GeneralResponseModel } from "@/domain/entities/general";
import Message from "@/data/models/message";
import { Channel } from "@/domain/entities/channel";

export interface IGeneralDataSource {
  getAll(): Promise<GeneralResponseModel[] | null>;
  createOrUpdateUser(uid: string, name: string, email: string): Promise<LoginResponseModel | null>;
  updateUser(uid: string, name: string, email: string): Promise<LoginResponseModel | null>;
  getUserById(uid: string): Promise<LoginResponseModel | null>;
  createUser(uid: string, name: string, email: string): Promise<LoginResponseModel | null>;

  sendMessage(message: MessageRequest): Promise<void>;
  getChannelMessages(channelId: string): Promise<Message[] | null>;

  getAllChannels(): Promise<Channel[] | null>;
  createChannel(name: string): Promise<Channel[] | null>;
  deleteChannel(channelId: string): Promise<void>;
}
