var Users = require('../models/users');
var userController = {};

userController.getAllUsersQuery = function() {
   	return Users.find({});
}

userController.getSingleUserByQuery = function(query) {
	return Users.findOne(query);
}

module.exports = userController;