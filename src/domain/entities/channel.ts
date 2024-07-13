import { Message } from "./message";

export interface Channel {
  id: string;
  name: string;
  messages: Message[]
}
