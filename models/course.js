var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var courseSchema = new mongoose.Schema({
    name: String,
    description: String,
    professors: [ObjectId],
    dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Course', courseSchema);
