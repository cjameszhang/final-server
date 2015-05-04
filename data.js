var mongoose = require('mongoose');
var Class = require('./models/class');
var Professor = require('./models/professor')
var classes = require('./data/classes.json');
var professors = require('./data/professors.json');

//mongoose.connect('mongodb://localhost/final');
mongoose.connect('mongodb://cs498:final@ds031792.mongolab.com:31792/final');

mongoose.connection.on('connected', function() {
  console.log('connected to database');

  // add classes to database
  for (var i = 0; i < classes.length; i++) {
    var item = classes[i];
    var obj = new Class({ _id: item._id, name: item.name });
    obj.save(callback);
  }

  // add professors to database
  for (var i = 0; i < professors.length; i++) {
    var item = professors[i];
    var obj = new Professor({ name: item });
    obj.save(callback);
  }
}); 

mongoose.connection.on('error', function(err) { 
  console.log('error: ' + error);
}); 

var saved = 0;
var total = classes.length + professors.length;
function callback() {
  ++saved;
  if (saved === total)
    console.log('all ' + total + ' items added');
}