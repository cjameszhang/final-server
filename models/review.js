var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var reviewSchema = new mongoose.Schema({
    user: {type:ObjectId, required: 'a user is required!'},
    course: {type:ObjectId, required: 'a course is required!'},
    professor: {type: ObjectId, required: 'a prof is required!'},
    comments: [ObjectId],
    rating: {type: Number, min:0, max:10, required: 'a rating is required!'},
    title: {type: String, required:'a title is required!'},
    body: {type:String, required:'a body is required!'},
    upvotes:[ObjectId],
    downvotes: [ObjectId],
    dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Review', reviewSchema);
