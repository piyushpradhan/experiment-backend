export const kafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || 'showoff',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),

  topics: {
    messages: 'chat.messages',
    channels: 'chat.channels',
    notifications: 'chat.notifications',
  },

  consumerGroups: {
    messages: 'chat-messages-group',
    channels: 'chat-channels-group',
    notifications: 'chat-notifications-group',
  },

  retry: {
    initialRetryTime: 100,
    retries: 3,
  },
};
