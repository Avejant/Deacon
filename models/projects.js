var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = new Schema({
    name: String,
    shortName: String,
    projectManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Project', Project);
