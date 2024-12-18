import { app as server } from './server';
import { createServer } from 'http';
import { connectPSQL } from './data/sequelize';
import AuthRouter from './presentation/routers/auth-router';
import { AuthUseCaseImpl } from './domain/use-cases/auth';
import { AuthRepositoryImpl } from './domain/repositories/auth-repository';
import MessageRouter from './presentation/routers/message-router';
import { MessageUseCaseImpl } from './domain/use-cases/message-use-case';
import { MessageRepository } from './domain/repositories/message-repository';
import { ChannelRepository } from './domain/repositories/channel-repository';
import { RedisDatabaseWrapperImpl } from './data/data-sources/redis/redis-db-wrapper';
import { KafkaWrapperImpl } from './data/data-sources/kafka/kafka-wrapper';
import { kafkaConfig } from './data/data-sources/kafka/config';
import { MessageProtocol, MessageServiceFactory } from './infrastructure/messaging/message-service-factory';

(async () => {
  const httpServer = createServer(server);

  // Initialize data sources - Postgres and Redis
  const dataSource = await connectPSQL();
  const redis = new RedisDatabaseWrapperImpl();
  const kafka = new KafkaWrapperImpl();

  await kafka.connect();
  await kafka.createTopics([kafkaConfig.topics.messages, kafkaConfig.topics.channels]);

  const messageRepository = new MessageRepository(dataSource, redis);
  const channelRepository = new ChannelRepository(dataSource, redis);

  // Initialize the message service factory
  const messageServiceFactory = new MessageServiceFactory(httpServer, messageRepository, channelRepository, kafka);

  const authMiddleware = AuthRouter(new AuthUseCaseImpl(new AuthRepositoryImpl(dataSource)));
  const messageMiddleware = MessageRouter(
    new MessageUseCaseImpl(messageRepository, messageServiceFactory),
    messageServiceFactory.getService(MessageProtocol.KAFKA),
  );

  server.use('/auth', authMiddleware);
  server.use('/message', messageMiddleware);

  httpServer.listen(3000, () => console.log('Running on http://localhost:3000'));
})();
