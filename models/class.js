var mongoose = require('mongoose');

var ClassSchema = new mongoose.Schema({
  _id: String,
  name: String,
});

module.exports = mongoose.model('Class', ClassSchema);