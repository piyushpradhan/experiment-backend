import { app as server } from "./server";
import { createServer } from "http";
import { connectPSQL } from "./data/sequelize";
import AuthRouter from "./presentation/routers/auth-router";
import { AuthUseCaseImpl } from "./domain/use-cases/auth";
import { AuthRepositoryImpl } from "./domain/repositories/auth-repository";
import MessageRouter from "./presentation/routers/message-router";
import { MessageUseCaseImpl } from "./domain/use-cases/message-use-case";
import { MessageRepository } from "./domain/repositories/message-repository";
import { SocketServer } from "./infrastructure/socket/socketServer";
import { ChannelRepository } from "./domain/repositories/channel-repository";
import { RedisDatabaseWrapperImpl } from "./data/data-sources/redis/redis-db-wrapper";

(async () => {
  const httpServer = createServer(server);

  // Initialize data sources - Postgres and Redis
  const dataSource = await connectPSQL();
  const redis = new RedisDatabaseWrapperImpl();

  const messageRepository = new MessageRepository(dataSource, redis);
  const channelRepository = new ChannelRepository(dataSource, redis);

  const socketServer = new SocketServer(httpServer, messageRepository, channelRepository);

  const authMiddleware = AuthRouter(
    new AuthUseCaseImpl(new AuthRepositoryImpl(dataSource))
  );

  const messageMiddleware = MessageRouter(
    new MessageUseCaseImpl(messageRepository, socketServer)
  )

  server.use("/auth", authMiddleware);
  server.use("/message", messageMiddleware);

  httpServer.listen(3000, () => console.log("Running on http://localhost:3000"));
})();
