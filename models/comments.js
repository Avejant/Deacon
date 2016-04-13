var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
    text: String,
    createdAt: Date,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Comment', Comment);
