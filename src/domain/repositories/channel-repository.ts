import { Channel } from "@/domain/entities/channel";
import { IChannelRepository } from "../interfaces/repositories/channel-repository";
import { PGDataSource } from "@/data/data-sources/postgres/postgres-general-data-source";

export class ChannelRepository implements IChannelRepository {
  pgDataSource: PGDataSource;
  constructor(pgDataSource: PGDataSource) {
    this.pgDataSource = pgDataSource;
  }

  async createChannel(name: string): Promise<Channel[] | null> {
    return await this.pgDataSource.createChannel(name);
  }

  async getAllChannels(): Promise<Channel[] | null> {
    return await this.pgDataSource.getAllChannels();
  }
}
