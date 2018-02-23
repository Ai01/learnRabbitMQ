const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length === 0) {
  process.exit(1);
}

const generateUuid = () => {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
};

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    ch.assertQueue('', { exclusive: true }, (err, q) => {
      const corr = generateUuid();
      const num = parseInt(args[0]);

      ch.consume(
        q.queue,
        msg => {
          if (msg.properties.correlationId === corr) {
            console.log(` got ${msg.content.toString()} `);
            setTimeout(() => {
              conn.close();
              process.exit();
            }, 500);
          }
        },
        { noAck: true },
      );


      ch.sendToQueue('rpc_queue', new Buffer(num.toString()), { correlationId: corr, replyTo: q.queue });
    });
  });
});
