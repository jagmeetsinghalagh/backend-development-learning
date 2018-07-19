const http = require('http');
const express = require('express');
const mongoose = require('mongoose');

const Dishes = require('./models/dishes');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

const hostname = "localhost";
const port = 3000;

const app = express();

connect.then( (db) => {
	console.log("connected successfully to the database");

	Dishes.create({
		name: 'butter chicken',
		description: 'yummy yummy'
	})
	.then( (dish) => {
		console.log(dish);

		 return Dishes.findByIdAndUpdate(dish._id,{
		 	$set: { description: 'updated test'}
		 },{
		 	new: true
		 })
		 .exec();
	})
	.then( (dish) => {
		console.log(dish);

		dish.comments.push({
			rating:4,
			comment: "I'm loving it",
			author: "jagmeet"
		});

		return dish.save();
	})
	.then( (dish) => {
		console.log(dish);

		return Dishes.remove();
	})
	.then( () => {
		return mongoose.connection.close();
	})
	.catch( (err) => {
		console.log(err);
	});
});


const server = http.createServer(app);
server.listen(port,hostname, () => {
	console.log(`Server started at http://${hostname}:${port}`)
});