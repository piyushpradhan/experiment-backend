import { Channel } from "diagnostics_channel";
import { IChannelRepository } from "../interfaces/repositories/channel-repository";
import { PGDataSource } from "@/data/data-sources/postgres/postgres-general-data-source";

export class ChannelRepository implements IChannelRepository {
  pgDataSource: PGDataSource;
  constructor(pgDataSource: PGDataSource) {
    this.pgDataSource = pgDataSource;
  }

  async create(channel: Channel): Promise<void> {
    try {

    } catch (err) {
      console.error("Failed to create a channel", err);
    }
  }
}
