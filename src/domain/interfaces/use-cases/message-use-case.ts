import { Message } from "@/domain/entities/message";

export interface IMessageUseCase {
  sendMessage(message: Omit<Message, "id">): Promise<void>
}
