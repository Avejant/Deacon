var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = new Schema({
    name: String,
    shortName: String,
    projectManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sprints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sprint'
    }]
});

module.exports = mongoose.model('Project', Project);
