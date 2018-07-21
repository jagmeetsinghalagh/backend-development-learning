const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const User = require('../models/users');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/')
	.get( (req,res,next) => {
		User.find({})
			.then( (users) => {
				console.log("Found All Users:\n");
				console.log(users);
				res.statusCode = 200;
				res.setHeader("Content-Type","application/json");
				res.json(users);
			},(err) => { console.log(err); })
			.catch( (err) => { console.log(err); });
	})
	.delete( (req,res,next) => {
		User.remove({})
			.then( (resp) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
        		res.json(resp);
			}, (err) => { console.log(err); })
			.catch( (err) => { console.log(err); });
	});

userRouter.post('/signup', (req,res,next) => {
	User.register(new User({username: req.body.username}),
		req.body.password, (err,user) => {
			if (err) {
				res.statusCode = 500;
    			res.setHeader('Content-Type', 'application/json');
    			res.json({err: err});
			}
			else {
				passport.authenticate('local')(req,res, () => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({success: true, status: "Registration Successful"});
				});
			}
		});
});


userRouter.post('/login', passport.authenticate('local'),(req,res,next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type','application/json');
	res.json({success: true, status: "You Are Logged in!!!"});
});

userRouter.get('/logout', (req,res) => {
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session_id');
		res.end("Successfully Logged Out!");
	}
	else {
		var err = new Error('You are not logged in!');
    	err.status = 403;
    	next(err);
	}
});

module.exports = userRouter;