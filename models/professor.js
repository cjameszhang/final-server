var mongoose = require('mongoose');

var ProfessorSchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model('Professor', ProfessorSchema);