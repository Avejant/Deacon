var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sprint = new Schema({
    name: String,
    beginning: Date,
    ending: Date,
    active: {
        type: Boolean,
        default: true
    }
});
module.exports = mongoose.model('Sprint', Sprint);
