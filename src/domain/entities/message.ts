export interface Message {
  id: string;
  channelId: string;
  sender: string;
  contents: string;
  timestamp: Date
}

export interface MessagesRequest {
  channelId: string
}
