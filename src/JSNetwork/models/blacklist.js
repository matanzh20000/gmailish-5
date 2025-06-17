const net = require('net');

/**
 * Opens a TCP connection to the C++ server, sends “command\n”,
 * waits for a single “data” event, then resolves with that response.
 * Uses SERVER_HOST and SERVER_PORT from process.env.
 */

function sendToCppServer(message) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    client.connect(5555, 'cppserver', () => {
      client.write(message + '\n');
    });

    client.on('data', data => {
      resolve(data.toString());
      client.destroy();
    });

    client.on('error', err => {
      reject(err);
    });
  });
}


module.exports = { sendToCppServer };
