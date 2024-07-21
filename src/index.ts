import { app as server } from "./server";
import GeneralRouter from "./presentation/routers/general-router";
import { GetAllValues } from "./domain/use-cases/general/get-all-values";
import { GeneralRepositoryImpl } from "./domain/repositories/general-repository";
import { CreateValue } from "./domain/use-cases/general/create-value-use-case";
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

(async () => {
  const httpServer = createServer(server);
  const dataSource = await connectPSQL();

  const messageRepository = new MessageRepository(dataSource);
  const channelRepository = new ChannelRepository(dataSource);

  const socketServer = new SocketServer(httpServer, messageRepository, channelRepository);

  const generalMiddleware = GeneralRouter(
    new GetAllValues(new GeneralRepositoryImpl(dataSource)),
    new CreateValue(new GeneralRepositoryImpl(dataSource))
  );

  const authMiddleware = AuthRouter(
    new AuthUseCaseImpl(new AuthRepositoryImpl(dataSource))
  );

  const messageMiddleware = MessageRouter(
    new MessageUseCaseImpl(messageRepository, socketServer)
  )

  server.use("/general", generalMiddleware);
  server.use("/auth", authMiddleware);
  server.use("/message", messageMiddleware);

  httpServer.listen(3000, () => console.log("Running on http://localhost:3000"));
})();
