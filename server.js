var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
	passport = require('passport'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	config = require('./app/config.js');

mongoose.connect(config.db);
require('./app/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  type: '*/x-www-form-urlencoded',
  extended: true
}));

app.use(session({ secret: config.secret }));
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, passport);
require('./app/api.js')(app, express.Router(), mongoose.connection);

app.listen(port);
console.log('Server running on port ' + port);