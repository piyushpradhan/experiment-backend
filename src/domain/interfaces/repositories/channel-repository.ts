import { Channel } from "@/domain/entities/channel";

export interface IChannelRepository {
  createChannel(name: string): Promise<Channel[] | null>;
  getAllChannels(): Promise<Channel[] | null>;
}
