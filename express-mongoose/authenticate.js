const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
var User = require('./models/users');

passport.use(new LocalStrategy(User.authenticate()));

exports.getToken = function(user) {
	return jwt.sign(user,'12345-67890',
		{expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = '12345-67890';


passport.use(new JwtStrategy(opts, (jwt_payload,done) => {
	console.log("JWT payload",jwt_payload);
	User.findOne({ _id: jwt_payload._id})
		.then( (user,err) => {
			if (err) {
				return done(err);
			}
			if(user) {
				return done(null,user);
			}
			else {
				return done(null,false);
			}
		})
		.catch( (err) => {
			console.log(err);
		});
}));

exports.verifyUser = passport.authenticate('jwt', { session: false });