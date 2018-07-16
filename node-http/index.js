// first import http module with require
const http = require('http');

//to serve a file first import filesystem and path file 
const fs = require('fs');
const path = require('path');

//create a hostname and port
const hostName = 'localhost';
const port = 3000;

/*to create a server use createServer() of http module
 which takes a callback in which we pass two values request and response*/
const server = http.createServer( (req,res) => {
	console.log('Request For ' + req.url + ' by method ' + req.method);
	if(req.method == 'GET'){
		var fileUrl;
		if(req.url == '/') fileUrl='/index.html';
		else fileUrl = req.url;

		var filePath = path.resolve('./client' + fileUrl);
		res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(res); 
	}
	 
});

/*After creating server we have to listen to it with listen()
which takes three arguements a port, a hostname and a callback function*/
server.listen(port,hostName, () => {
	console.log(`server running at http://${hostName}:${port}`);
});
