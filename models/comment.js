var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var commentSchema = new mongoose.Schema({
    review: {type:ObjectId, required:'a review is required'},
    user: {type:ObjectId, required: 'user is required'},
    body: {type:String, required: 'body is required'},
    dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', commentSchema);
