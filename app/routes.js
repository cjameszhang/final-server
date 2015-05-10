module.exports = function(app, passport) {
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

	// Define GET route for /profile endpoint
	app.get('/profile', isLoggedIn, function(req, res) {
		//console.log('profile: ' + req.user.name);
		//console.log('profile: ' + req.user.picture);
		res.json({
			user: req.user
		});
	});
	
	// Define GET route for /logout endpoint
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	// Define custom isLoggedIn middleware
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();

		res.json({
			error: 'User is not logged in'
		});
	}
};