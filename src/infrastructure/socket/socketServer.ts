import { MessagesRequest } from "@/domain/entities/message";
import { MessageRepository } from "@/domain/repositories/message-repository";
import { DeleteSocketRequest, SocketMessageData } from "@/infrastructure/socket/types";
import { Server } from "socket.io";

export class SocketServer {
  private io: Server;
  private repository: MessageRepository;

  constructor(server: any, repository: MessageRepository) {
    this.io = new Server(server, {
      cors: {
        origin: "*"
      }
    });
    this.repository = repository;

    this.initialize();
  }

  public initialize(): void {
    this.io.on("connection", (socket) => {
      socket.on("join", async (channelId: string) => {
        socket.join(channelId);

        await this.emitChannelMessages(channelId);
      });

      socket.on("requestChannelMessages", async (channelId: string) => {
        await this.emitChannelMessages(channelId);
      });

      socket.on("message", async (data: SocketMessageData) => {
        await this.sendMessage(data);
        const messages = await this.getAllChannelMessages({ channelId: data.channelId });
        this.io.emit("channelMessages", messages);
      });

      socket.on("deleteMessage", async (data: DeleteSocketRequest) => {
        await this.deleteMessage(data);
        const messages = await this.getAllChannelMessages({ channelId: data.channelId });
        this.io.emit("channelMessages", messages);
      })

      socket.on("disconnect", () => {
        console.log("Client disconnect");
      });
    });
  }

  private async emitChannelMessages(channelId: string) {
    const messages = await this.getAllChannelMessages({ channelId });
    this.io.emit("channelMessages", messages);
  }

  private async getAllChannelMessages(data: MessagesRequest) {
    const messages = await this.repository.getChannelMessages(data.channelId);
    return messages;
  }

  private async sendMessage(data: SocketMessageData) {
    const timestamp = new Date();
    await this.repository.send({
      ...data,
      timestamp
    });
  }

  private async deleteMessage(data: DeleteSocketRequest) {
    await this.repository.deleteMessage(data.channelId, data.sender);
  }

  public emitMessage(channelId: string, sender: string, content: string): void {
    const data = { channelId, sender, content };
    this.io.to(channelId).emit('message', data);
  }
}
