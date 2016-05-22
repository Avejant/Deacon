var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Issue = new Schema({
  name
});
module.exports = mongoose.model('Issue', Issue);
