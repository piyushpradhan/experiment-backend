export interface KafkaMessage {
  key?: string;
  value: string;
  partition?: number;
  headers?: Record<string, string>;
}

export interface KafkaWrapper {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  produce(topic: string, messages: KafkaMessage[]): Promise<void>;
  consume(topic: string, groupId: string, callback: (message: KafkaMessage) => Promise<void>): Promise<void>;
  createTopics(topics: string[]): Promise<void>;
}
