import { Server } from "socket.io";

export class SocketServer {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "*"
      }
    });

    this.initialize();
  }

  public initialize(): void {
    this.io.on("connection", (socket) => {
      console.log("connected");
      socket.on("join", (channelId: string) => {
        console.log("joined", channelId);
        socket.join(channelId);
      });

      socket.on("message", async (data: { channelId: string, sender: string, contents: string }) => {
        console.log("Does this work ?", data);
        this.io.emit("updatedMessages", data);
        //this.io.to(data.channelId).emit("getMessages", data);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnect");
      });
    });
  }

  public emitMessage(channelId: string, sender: string, content: string): void {
    const data = { channelId, sender, content };
    this.io.to(channelId).emit('message', data);
  }
}
