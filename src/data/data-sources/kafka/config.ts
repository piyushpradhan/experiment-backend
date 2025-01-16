export enum KafkaTopics {
  CHANNEL_CREATED = 'chat.channels.created',
  CHANNEL_DELETED = 'chat.channels.deleted',
  MESSAGE_SENT = 'chat.messages.sent',
  MESSAGE_DELETED = 'chat.messages.deleted',
  CHANNEL_MESSAGES = 'chat.messages.all',
}

export enum KafkaConsumerGroups {
  CHANNEL_EVENTS = 'chat-channel-events',
  MESSAGE_EVENTS = 'chat-message-events',
}

export interface KafkaEvent<T> {
  id: string;
  type: KafkaTopics;
  timestamp: string;
  payload: T;
}

export interface MessageEvent {
  messageId: string;
  channelId: string;
  sender: string;
  content: string;
  taggedMessage?: string;
}

export interface ChannelEvent {
  channelId: string;
  name: string;
  lastMessage?: string;
}

export const kafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || 'showoff',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),

  topics: {
    messages: 'chat.messages',
    channels: 'chat.channels',
  },

  consumerGroups: {
    messages: 'chat-messages-group',
    channels: 'chat-channels-group',
  },

  retry: {
    initialRetryTime: 100,
    retries: 3,
  },
};
