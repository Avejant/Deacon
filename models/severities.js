var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Severity = new Schema({
	name: String
});

module.exports = mongoose.model('Severity', Severity);