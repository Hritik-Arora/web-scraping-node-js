const http = require('http');
const cacheUtil = require('./utils/cache');
const app = require('./app');

const port = process.env.PORT || 4000;
/**
 * Most hosting services provise us with environment variables to be injected into our NodeJs project, so we
 * simply use process.env.PORt. If this is not available, we'll use 3000 as the port number.
*/

// When the server is started, we will start the poll of fetching covid data from
cacheUtil.init();
const server = http.createServer(app);

server.listen(port);