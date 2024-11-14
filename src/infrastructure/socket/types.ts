export type SocketMessageData = {
  channelId: string;
  sender: string;
  contents: string;
  taggedMessage?: string;
};

export type DeleteSocketRequest = {
  channelId: string;
  sender: string;
};

export type CreateChannelRequest = {
  name: string;
};

export type DeleteChannelRequest = {
  channelId: string;
};

export type SingleMessageDetailRequest = {
  messageId: string;
};
