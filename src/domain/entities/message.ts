export interface Message {
  id: string;
  channelId: string;
  sender: string;
  contents: string;
  timestamp: Date;
  taggedMessage?: string;
}

export interface MessagesRequest {
  channelId: string;
}

export interface LoadMoreMessagesRequest extends MessagesRequest {
  offset: number;
  limit: number;
}
