const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());


dishRouter.route('/')
	.get( (req,res,next) => {
		Dishes.find({})
			.populate('comments.author')
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

dishRouter.route('/:dishId')
	.get( (req,res,next) => {
		Dishes.findOne({ _id: req.params.dishId})
			.populate('comments.author')
			.then( (dish) => {
				if (dish){
					res.statusCode = 200;
					res.setHeader('content-type','application/json');
					res.json(dish);
				}
				if (dish == null) {
					res.end("No Dish Available");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	})
	.post( (req,res,next) => {
		res.end(`POST method not allowed on dishes/${req.params.dishId}`);
	})
	.put( authenticate.verifyUser, (req,res,next) => {
		Dishes.findByIdAndUpdate(req.params.dishId,{
			$set: req.body
		},{new: true })
		.then( (dish) => {
			res.statusCode = 200;
			res.setHeader('content-type','application/json');
			res.json(dish);
		})
		.catch( (err) => {
			console.log(err);
		});
	})
	.delete( authenticate.verifyUser, (req,res,next) => {
		Dishes.findByIdAndRemove(req.params.dishId)
			.then( (resp) => {
				res.statusCode = 200;
				res.setHeader('content-type','application/json');
				res.json(resp);
			})
			.catch( (err) => {
				console.log(err);
			});
	});

dishRouter.route('/:dishId/comments')
	.get( (req,res,next) => {
		Dishes.findById(req.params.dishId)
			.populate('Comments.author')
			.then( (dish) => {
				if ( dish != null) {
					res.statusCode = 200;
					res.setHeader('content-type','application/json');
					res.json(dish.comments);
				}
			})
			.catch( (err) => {
				console.log(err);
			});
	})
	.post( authenticate.verifyUser, (req,res,next) => {
		Dishes.findById(req.params.dishId)
    		.then((dish) => {
    			if (dish != null) {
    			console.log(req.user);
    			req.body.author = req.user._id;	
            	dish.comments.push(req.body);
            	console.log(req.body.author);
            	dish.save()
            		.then((dish) => {
            			res.statusCode = 200;
                		res.setHeader('Content-Type', 'application/json');
                		res.json(dish);                
            		}, (err) => next(err));
        		}
        		else {
            		err = new Error('Dish ' + req.params.dishId + ' not found');
            		err.status = 404;
            		return next(err);
        		}
        	})
        	.catch((err) => {
        		console.log(err);
        	});
	})
	.put(authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /dishes/'
			+ req.params.dishId + '/comments');
	})
	.delete((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if (dish != null) {
					for (var i = (dish.comments.length -1); i >= 0; i--) {
						dish.comments.id(dish.comments[i]._id).remove();
					}
					dish.save()
						.then((dish) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(dish);                
						}, (err) => next(err));
					}
				else {
					err = new Error('Dish ' + req.params.dishId + ' not found');
					err.status = 404;
					return next(err);
				}
			}, (err) => next(err))
			.catch((err) => console.log(err));    
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;
	