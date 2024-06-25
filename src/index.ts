import { app as server } from "./server";
import GeneralRouter from "./presentation/routers/general-router";
import { GetAllValues } from "./domain/use-cases/general/get-all-values";
import { GeneralRepositoryImpl } from "./domain/repositories/general-repository";
import { CreateValue } from "./domain/use-cases/general/create-value-use-case";
import { createServer } from "http";
import { connectPSQL } from "./data/sequelize";

(async () => {
  const dataSource = await connectPSQL();

  const generalMiddleware = GeneralRouter(
    new GetAllValues(new GeneralRepositoryImpl(dataSource)),
    new CreateValue(new GeneralRepositoryImpl(dataSource))
  );

  server.use("/general", generalMiddleware);

  const httpServer = createServer(server);
  httpServer.listen(3000, () => console.log("Running on http://localhost:3000"));
})();
