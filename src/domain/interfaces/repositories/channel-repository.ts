import { Channel } from "diagnostics_channel";

export interface IChannelRepository {
  create(channel: Channel): Promise<void>;
}
