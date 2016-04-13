var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IssueType = new Schema({
    name: String
});

module.exports = mongoose.model('IssueType', IssueType);
