import { Request as ExpressRequest } from 'express';
import { MessageProtocol } from './infrastructure/messaging/message-service-factory';

export interface Request extends ExpressRequest {
  messageProtocol?: MessageProtocol;
}
