import express, { Request, Response } from "express";

import { CreateValueUseCase } from "src/domain/interfaces/use-cases/create-value-use-case";
import { GetAllValuesUseCase } from "src/domain/interfaces/use-cases/get-all-general-values";

export default function GeneralRouter(
  getAllValuesUseCase: GetAllValuesUseCase,
  createValueUseCase: CreateValueUseCase
) {
  const router = express.Router();

  router.get("/", async (_req: Request, res: Response) => {
    try {
      const generalResponse = await getAllValuesUseCase.execute();
      res.send(generalResponse);
    } catch (err) {
      res.status(500).send("Error fetching all values");
    }
  });

  router.post("/create", async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const generalResponse = await createValueUseCase.execute(body);
      res.send(generalResponse);
    } catch (err) {
      res.status(500).send("Error creating value");
    }
  })

  return router;
}
