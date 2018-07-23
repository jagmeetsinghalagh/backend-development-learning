const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const authenticate = require('../authenticate');
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
				passport.authenticate('local',{session:false})(req,res, () => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({success: true, status: "Registration Successful"});
				});
			}
		});
});


userRouter.post('/login', passport.authenticate('local',{session:false}),(req,res) => {
	var token  = authenticate.getToken({ _id: req.user._id });
	console.log(token);
	res.statusCode = 200;
	res.setHeader('Content-Type','application/json');
	res.json({success: true,token: token, status: "You Are Logged in!!!"});
	console.log(res);
});



module.exports = userRouter;