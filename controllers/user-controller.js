var Users = require('../models/users');
var passwordHasher = require('password-hash');
var userController = {};

userController.getAllQuery = function() {
   	return Users.find({}).populate('role');
}

userController.getByQuery = function(query) {
	return Users.findOne(query).populate('role');
}

userController.getAll = function(req, res) {
	userController.getAllQuery().exec(function(err, users){
		if (err){
				res.error(err);
		} else {
			res.json(users);
		}
	})
}

userController.getById = function(req, res){
	userController.getByQuery({_id:req.params.id}).exec(function(err, user){
		if(!user) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

		if (err)
		{
			res.error(err);
		} 
		else 
		{  
			res.json(user);
		}
	});
}

userController.create = function(req, res) {
	var user = new Users({
		name: req.body.name
	});	

    user.save(function (err) {
        if (!err) {
            return res.redirect('/');
        } 
        else 
        {
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
        }
    });
}

userController.update = function(req, res) {
	Users.findById(req.params.id, function (err, user) {
        if(!user) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        username.password = password;
        username.firstName = req.body.firstName;
        username.lastName = req.body.lastName;
        username.email = req.body.email;
        username.location = req.body.location;
        username.role = req.body.choosenRole._id;

        return user.save(function (err) {
            if (!err) {
            	return res.redirect('/');
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
            }
        });
    });
}
userController.changePassword = function(req, res) {
    Users.findById(req.params.id, function(err, user) {
        if (err) 
        {
            throw err;
        }

/*        if (user.password !== req.body.oldPass)
        {
            res.send({errorMessage: 'Old password is wrong.'})
        }*/

        user.password = passwordHasher.generate(req.body.newPass);
        user.save(function(err) {
            if (!err) {
                res.send();
            }
        });
    });
}

userController.delete = function(req, res) {
	Users.findById(req.params.id, function (err, user) {
        if(!user) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return user.remove(function (err) {
            if (!err) {
            	return res.redirect('/');
            } 
            else {
                res.statusCode = 500;
                return res.send({ error: 'Server error' });
            }
        });
    });
}
module.exports = userController;