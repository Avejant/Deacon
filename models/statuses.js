var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Status = new Schema({
	name:String
});

module.exports = mongoose.model('Status', Status);