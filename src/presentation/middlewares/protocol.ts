import { Response, NextFunction } from 'express';
import type { Request } from '@/types';
import { MessageProtocol } from "../../infrastructure/messaging/message-service-factory";

export const protocolMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const protocol = req.headers['x-message-protocol'] as MessageProtocol;

  if (protocol && Object.values(MessageProtocol).includes(protocol)) {
    req.messageProtocol = protocol;
  } else {
    req.messageProtocol = MessageProtocol.SOCKET;
  }

  next();
};
