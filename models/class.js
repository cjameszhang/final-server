var mongoose = require('mongoose');

var ClassSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String
});

module.exports = mongoose.model('Class', ClassSchema);