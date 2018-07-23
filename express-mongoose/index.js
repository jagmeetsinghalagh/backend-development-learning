// require all the tools needed
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const authenticate = require('./authenticate');
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
const url = "mongodb://localhost:27017/conFusion";
//connect to that url
const connect = mongoose.connect(url);

connect.then( (db) => {
	console.log("Connected To The Database");
}, (err) => { console.log(err);
});


app.use(passport.initialize());

app.use("/users",userRouter);

app.use("/dishes",dishRouter);

