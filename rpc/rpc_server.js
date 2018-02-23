const amqp = require('amqplib/callback_api');
const fibonacci = require('./fibonacci').fibonacci;

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    const q = 'rpc_queue';

    ch.assertQueue(q, { durable: false });

    ch.prefetch(1);

    ch.consume(q, function reply(msg) {
      const n = parseInt(msg.content.toString());

      console.log(`fibonacci ${n}`);

      const r = fibonacci(n);

      ch.sendToQueue(
        msg.properties.replyTo,
        new Buffer(r.toString()),
        {
          correlationId: msg.properties.correlationId,
        }
      );

      ch.ack(msg);

    });
  });
});
