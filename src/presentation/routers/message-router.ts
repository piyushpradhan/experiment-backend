import express, { Response } from 'express';
import type { Request } from '@/types';

import { IMessageUseCase } from '@/domain/interfaces/use-cases/message-use-case';
import { Message } from '@/domain/entities/message';
import { MessageService } from '@/infrastructure/messaging/message-service';
import { KafkaMessagingService } from '../../infrastructure/messaging/strategies/kafka-strategy';

// TODO: Add the channel use case as well
export default function MessageRouter(messageUseCase: IMessageUseCase, messageService: MessageService) {
  const router = express.Router();

  router.post('/send', async (req: Request, res: Response) => {
    try {
      const message = req.body as Message;
      await messageUseCase.sendMessage(message, req.messageProtocol);
      res.status(200).send({ status: 'ok' });
    } catch (err) {
      res.status(500).send('Error sending message');
      console.error(err);
    }
  });

  router.get('/:channelId', (req, res) => {
    const channelId = req.params.channelId;

    if (!(messageService instanceof KafkaMessagingService)) {
      return res.status(400).send();
    }

    // Set headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const sendEvent = (eventName: string, data: any) => {
      res.write(`event: ${eventName}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const eventEmitter = messageService.getEventEmitter();

    const messageHandler = (data: any) => {
      console.log('this is being executed: ', data, channelId);
      if (data.channelId === channelId) {
        sendEvent('message', data);
      }
    };

    const errorHandler = (error: Error) => {
      console.error('SSE Error:', error);
      sendEvent('error', { message: 'Internal server error' });
    };

    eventEmitter.on('newMessage', messageHandler);
    eventEmitter.on('messageDeleted', messageHandler);
    eventEmitter.on('error', errorHandler);

    // Handle client disconnect
    req.on('close', () => {
      eventEmitter.off('newMessage', messageHandler);
      eventEmitter.off('messageDeleted', messageHandler);
      eventEmitter.off('error', errorHandler);
      res.end();
    });
  });

  return router;
}
