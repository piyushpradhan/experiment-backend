import { KafkaWrapperImpl } from '../src/data/data-sources/kafka/kafka-wrapper';
import { kafkaConfig } from '../src/data/data-sources/kafka/config';

async function runConsumer() {
  const kafka = new KafkaWrapperImpl();
  await kafka.connect();

  try {
    await kafka.consume(kafkaConfig.topics.messages, kafkaConfig.consumerGroups.messages, async (message) => {
      console.log('Received message:', message);
    });
  } catch (error) {
    console.error('Error consuming messages:', error);
  }
}

runConsumer().catch(console.error);
