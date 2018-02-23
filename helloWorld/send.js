const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    var q = 'hello';
    ch.assertQueue(q, { durable: false });
    ch.sendToQueue(q, new Buffer('hello world'));
    console.log('sent hello world');
  });
  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 500);
})


