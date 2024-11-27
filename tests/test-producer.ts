import { KafkaWrapperImpl } from '../src/data/data-sources/kafka/kafka-wrapper';
import { kafkaConfig } from '../src/data/data-sources/kafka/config';

async function runProducer() {
  const kafka = new KafkaWrapperImpl();
  await kafka.connect();

  try {
    await kafka.produce(kafkaConfig.topics.messages, [{ key: 'test-key', value: 'Hello, Kafka!' }]);
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    await kafka.disconnect();
  }
}

runProducer().catch(console.error);
