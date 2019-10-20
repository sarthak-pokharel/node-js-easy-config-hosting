"use strict";
const http = require('http');
const cont = require('./content.js');
const {log} = console;

let server = http.createServer(function network(request,response) {
	respond(request,response);
});

let port = process.env.port || 8000;
server.listen(port);
log("Server running at port %s",port);
log(`Target URL: http://localhost:${port}/`)

function respond(request,response) {
	let contentServe = cont.contentToServe(request,response);
	response.writeHead(contentServe[0][0]);
	response._header = 
`HTTP/1.1 ${contentServe[0][0]} served
Connection: keep-alive
Transfer-Encoding: chunked
Content-type: ${contentServe[0][1]} \n
`
	response.write(contentServe[1]);
	response.end();
}