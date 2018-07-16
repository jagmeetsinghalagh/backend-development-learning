//to create express server first require it
const express = require('express');

//require core http module to create server
const http = require('http');

//require path module 
const path = require('path');

//define hostname and port number
const hostname = 'localhost';
const port = 3000;

//initialise express app
const app = express();


app.use( (req,res,next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname + '/client/index.html'));
});

const server = http.createServer(app);

server.listen(port,hostname, () => {
	console.log(`server started at http://${hostname}:${port}`);
})
