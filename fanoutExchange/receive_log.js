const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    const ex = 'logs';

    ch.assertExchange(ex, 'fanout', { durable: false });

    ch.assertQueue('', { xclusive: true }, (err, q) => {
      ch.bindQueue(q.queue, ex, '');

      ch.consume(
        q.queue,
        msg => {
          console.log(msg.content.toString());
        },
        { noAck: true },
      );
    });
  });
});
