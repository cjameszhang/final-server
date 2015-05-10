var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    name: {type:String, required:'A name is required!'},
    description: String,
    deadline: {type: Date, required:'A deadline is required!'},
    completed: {type: Boolean, default: false},
    assignedUser: {type: String, default: ''},
    assignedUserName: {type:String, default: 'unassigned'},
    dateCreated: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
