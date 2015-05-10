//var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		//console.log('serialize: ' + user.id + ' ' + user._id);
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			//console.log('deserialize: ' + user);
			if (!err) done(null, user);
			else done(err, null);
		});
	});

	passport.use(new FacebookStrategy({
		clientID: '537795573027675',
		clientSecret: '079cd6f5ab617774dc74475ff328bf01',
		callbackURL: 'http://localhost:3000/auth/facebook/callback',
		profileFields: ['id', 'displayName', 'photos']
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
		User.findOne({facebookId: profile.id}, function(err, user) {
			if (err)
				return done(err);

			//console.log(profile.photos[0].value);
			//console.log(user.name);
			//console.log(user.picture);
			if (!user) {
				user = new User({facebookId: profile.id, name: profile.displayName, picture: profile.photos[0].value });
				user.save(function(err) {
					return done(err, user);
				});
			} else if (user.name != profile.displayName || user.picture != profile.photos[0].value) {
				user.name = profile.displayName;
				user.picture = profile.photos[0].value;
				user.save(function(err) {
					return done(err, user);
				});
			} else {
				return done(err, user);
			}
		});

	}); // align!
	}
	));
};
