const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());


dishRouter.route('/')
	.get( (req,res,next) => {
		Dishes.find({})
			.then( (dishes) => {
				console.log("Found All The Dishes\n");
				console.log(dishes);
				res.statusCode = 200;
				res.setHeader('content-type','application/json');
				res.json(dishes);
			}, (err) => { console.log(err); })
			.catch( (err) => { console.log(err); });
	})
	.post(authenticate.verifyUser,(req,res,next) =>{
		Dishes.create(req.body)
			.then( (dish) => {
				console.log('Dish Created',dish);
				res.statusCode = 200;
				res.setHeader('content-type','application/json');
				res.json(dish);
			}, (err) => { console.log(err); })
			.catch( (err) => { console.log(err); });
	})
	.put(authenticate.verifyUser, (req,res,next) => {
		res.statusCode = 403;
    	res.end('PUT operation not supported on /dishes');
	})
	.delete(authenticate.verifyUser, (req,res,next) => {
		Dishes.remove({})
			.then( (resp) => {
				res.statusCode = 200;
        		res.setHeader('Content-Type', 'application/json');
        		res.json(resp);
			}, (err) => { console.log(err); })
			.catch( (err) => { console.log(err); });
	});

module.exports = dishRouter;
	