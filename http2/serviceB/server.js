const Hapi = require('hapi');
const Good = require('good');
const Http2 = require('http2'); // eslint-disable-line
const fs = require('fs');

const options = {
  reporters: {
    myConsoleReporter: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', response: '*' }],
      }, {
        module: 'good-console',
      }, 'stdout',
    ],
  },
};

const serverOptions = {
  key: fs.readFileSync('../certificates/localhost-privatekey.pem'),
  cert: fs.readFileSync('../certificates/localhost-certificate.pem'),
};

const listener = Http2.createSecureServer(serverOptions);

const server = Hapi.server({
  port: 8001,
  tls: true,
  listener,
});

server.route({
  method: 'GET',
  path: '/id',
  handler: async (request, h) => {
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 1,
        });
      }, 10);
    });
    return h.response(response);
  },
});

server.route({
  method: 'GET',
  path: '/name',
  handler: async (request, h) => {
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: 'Abhinav Dhasmana',
        });
      }, 10);
    });
    return h.response(response);
  },
});

server.route({
  method: 'GET',
  path: '/passion',
  handler: async (request, h) => {
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          enjoy_coding: true,
        });
      }, 10);
    });
    return h.response(response);
  },
});

const start = async () => {
  try {
    if (!module.parent) {
      await server.register({
        plugin: Good,
        options,
      });
      await server.start();
    }
    console.log('server started');
  } catch (err) {
    console.log('failed to start the server', err);
  }
};

start();
