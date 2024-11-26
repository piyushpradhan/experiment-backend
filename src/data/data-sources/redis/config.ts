export const redisConfig = {
  url: process.env.REDIS_URL,
  retryAttempts: 3,
  retryDelay: 1000,

  ttl: {
    channels: 3600,
    messages: 1800,
    users: 7200,
    defaultTTL: 3600,
  },

  keys: {
    channel: 'channel:',
    message: 'message:',
    user: 'user:',
    channelMessages: 'channel:messages:',
    channelList: 'channels',
  },
};
