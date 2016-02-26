var Users = require('../models/users');
var userController = {};

userController.getAllQuery = function() {
   	return Users.find({});
}

userController.getByQuery = function(query) {
	return Users.findOne(query);
}

module.exports = userController;