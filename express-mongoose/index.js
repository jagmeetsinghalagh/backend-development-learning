const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileStore = require('session-file-store')(session);

const userRouter  = require('./routes/userRouter');
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

app.use(session({
	name: 'session_id',
	secret: '12345-67890',
	saveUninitialized: false,
  	resave: false, 
	store: new fileStore()
}));

app.use("/users",userRouter);

// Basic Authentication
function auth(req,res,next) {
	console.log(req.session);
	if (!req.session.user) {
			var err = new Error("You Are Not Authorized ");
			res.setHeader("www-Authenticate","Basic");
			err.status = 401;
			return next(err);
	}
	else {
		if (req.session.user === 'authenticated') {
			next();
		}
		else {
      		var err = new Error('You are not authenticated!');
      		err.status = 403;
      		return next(err);
    	}
	}
};

app.use(auth);

//use Dish Router that we have created
app.use("/dishes",dishRouter);

