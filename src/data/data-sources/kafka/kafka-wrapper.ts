import { KafkaWrapper, KafkaMessage } from '@/data/interfaces/data-sources/kafka-wrapper';
import { Consumer, Kafka, Partitioners, Producer, TopicMessages } from 'kafkajs';
import { kafkaConfig } from './config';

export class KafkaWrapperImpl implements KafkaWrapper {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer>;

  constructor() {
    this.kafka = new Kafka({
      brokers: kafkaConfig.brokers,
      retry: kafkaConfig.retry,
    });

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    this.consumers = new Map();
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      console.log('Kafka producer connected');
    } catch (err) {
      console.error('Failed to connect to Kafka: ', err);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      console.log('Kafka producer disconnected');
    } catch (err) {
      console.error('Failed to disconnect from Kafka: ', err);
    }
  }

  async produce(topic: string, messages: KafkaMessage[]): Promise<void> {
    try {
      const kafkaMessages: TopicMessages = {
        topic,
        messages: messages.map((msg) => ({
          key: msg.key,
          value: msg.value,
          partition: msg.partition,
          headers: msg.headers,
        })),
      };
      await this.producer.send(kafkaMessages);
    } catch (err) {
      console.error(`Failed to produce message to topic ${topic}: `, err);
    }
  }

  async consume(topic: string, groupId: string, callback: (message: KafkaMessage) => Promise<void>): Promise<void> {
    try {
      const consumer = this.kafka.consumer({ groupId });
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ message }) => {
          const kafkaMessage: KafkaMessage = {
            key: message.key?.toString(),
            value: message.value?.toString() || '',
            headers: message.headers as Record<string, string>,
          };

          await callback(kafkaMessage);
        },
      });

      this.consumers.set(topic, consumer);
    } catch (err) {
      console.error(`Failed to consume messages from topic ${topic}: `, err);
    }
  }

  async createTopics(topics: string[]): Promise<void> {
    const admin = this.kafka.admin();
    try {
      await admin.createTopics({
        topics: topics.map((topic) => ({ topic })),
      });
    } finally {
      await admin.disconnect();
    }
  }
}
