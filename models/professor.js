var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var professorSchema = new mongoose.Schema({
    name: String,
    courses: [ObjectId],
    dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Professor', professorSchema);
