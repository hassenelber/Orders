const http = require('http');
const app = require('./ordersApp');

const port = process.env.PORT ||  7777;

const server = http.createServer(app);

server.listen(port);

