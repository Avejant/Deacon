var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    role: {
		type: Schema.ObjectId,
        ref: 'Role'
	},
    email:String,
    location: String,
    createdAt: Date,
    avatar: String
});

User.methods.validPassword = function(password) {
    return password === this.password;
};

module.exports = mongoose.model('User', User);