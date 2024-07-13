import express, { Request, Response } from "express";

import { IMessageUseCase } from "@/domain/interfaces/use-cases/message-use-case";
import { Message } from "@/domain/entities/message";

// TODO: Add the channel use case as well
export default function MessageRouter(messageUseCase: IMessageUseCase) {
  const router = express.Router();

  router.get('/send', async (req: Request, res: Response) => {
    try {
      const message = req.body as Message;
      await messageUseCase.sendMessage(message);
      res.status(200).send({ status: 'ok' })
    } catch (err) {
      res.status(500).send("Error sending message");
    }
  });

  return router;
}
