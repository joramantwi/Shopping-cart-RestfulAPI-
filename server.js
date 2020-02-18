const http = require('http'); // imports http package 
const app = require('./app'); // points to app file 

const port = process.env.PORT  || 3000; //sets server port 

const server = http.createServer(app); 

server.listen(port); 
