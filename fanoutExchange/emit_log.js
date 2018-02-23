const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    const ex = 'logs';
    const msg = process.argv.slice(2).join(' ') || 'hello world';

    ch.assertExchange(ex, 'fanout', { durable: false });
    ch.publish(ex, '', new Buffer(msg));

    console.log(`send ${msg}`);
  });

  setTimeout(() => {
    conn.close(), process.exit(0);
  }, 500);
});
