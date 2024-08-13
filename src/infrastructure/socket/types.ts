export type SocketMessageData = {
  channelId: string;
  sender: string;
  contents: string;
}

export type DeleteSocketRequest = {
  channelId: string;
  sender: string;
}

export type CreateChannelRequest = {
  name: string;
}

export type DeleteChannelRequest = {
  channelId: string;
}
