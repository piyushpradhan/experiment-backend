export interface Message {
  id: string;
  channelId: string;
  sender: string;
  contents: string;
  timestamp: Date;
  taggedMessage?: string;
}

export interface MessagesRequest {
  channelId: string
}
