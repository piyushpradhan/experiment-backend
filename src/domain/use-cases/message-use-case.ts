import { Message } from "../entities/message";
import { IMessageUseCase } from "../interfaces/use-cases/message-use-case";
import { MessageRepository } from "../repositories/message-repository";
import { SocketServer } from "@/infrastructure/socket/socketServer";

export class MessageUseCaseImpl implements IMessageUseCase {
  messageRepository: MessageRepository;
  socketServer: SocketServer;
  constructor(messageRepository: MessageRepository, server: SocketServer) {
    this.messageRepository = messageRepository;
    this.socketServer = server;
  }

  async sendMessage(message: Omit<Message, "id">): Promise<void> {
    try {
      // Emit socket event
      this.socketServer.emitMessage(message.channelId, message.sender, message.contents);
      // Update the database
      this.messageRepository.send(message);
    } catch (err) {
      console.error(err);
    }
  }
}
