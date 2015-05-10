var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({
    facebookId: String,
    name: String,
    picture: String,
    dateCreated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);
