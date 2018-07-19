const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const dishRouter = require('./routes/dishRouter');

//define hostname and port number for http server
const hostname = "localhost";
const port = 3000;

//Initialise express application
const app = express();

const server = http.createServer(app);

server.listen(port,hostname, () => {
	console.log(`Server Started On http://${hostname}:${port}`);
});

//define url of mongoDB server
const url = "mongodb://localhost:27017/";
//connect to that url
const connect = mongoose.connect(url);

connect.then( (db) => {
	console.log("Connected To The Database");
}, (err) => { console.log(err);
});

// Basic Authentication
function auth(req,res,next) {
	console.log(req.headers);
	var authHeader = req.headers.authorization;
	if(!authHeader) {
		var err = new Error("You Are Not Authorized ");
		res.setHeader("www-Authenticate","Basic");
		err.status = 401;
		return next(err);
	}

	var auth = new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');

	var user = auth[0];
	var password = auth[1];
	if(user == 'admin' && password == 'password') {
		next();	
	}
	else {
		var err = new Error('You are not authenticated!');
      	res.setHeader('WWW-Authenticate', 'Basic');      
      	err.status = 401;
      	next(err);
	}
};

app.use(auth);

//use Dish Router that we have created
app.use("/dishes",dishRouter);

