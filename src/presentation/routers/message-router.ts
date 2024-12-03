import express, { Response } from 'express';
import type { Request } from '@/types';

import { IMessageUseCase } from '@/domain/interfaces/use-cases/message-use-case';
import { Message } from '@/domain/entities/message';
import { protocolMiddleware } from '../middlewares/protocol';

// TODO: Add the channel use case as well
export default function MessageRouter(messageUseCase: IMessageUseCase) {
  const router = express.Router();

  router.use(protocolMiddleware);

  router.get('/send', async (req: Request, res: Response) => {
    try {
      const message = req.body as Message;
      await messageUseCase.sendMessage(message, req.messageProtocol);
      res.status(200).send({ status: 'ok' });
    } catch (err) {
      res.status(500).send('Error sending message');
      console.error(err);
    }
  });

  return router;
}
