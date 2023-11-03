const amq = require('amqplib');

class ProducerService {
  sendMessage = async (queue, message) => {
    const connection = await amq.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {durable: true});
    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  };
}

module.exports = ProducerService;
