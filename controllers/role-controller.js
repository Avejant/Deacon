var Roles = require('../models/roles');
var roleController = {};

roleController.getAllRolesQuery = function() {
   	return  Roles.find({});
}

roleController.getSingleRoleByQuery = function(query) {
	return Roles.findOne(query);
}

roleController.getAllRoles = function(req, res) {
		roleController.getAllRolesQuery().exec(function(err, roles){
		if (err){
				res.error(err);
		} else {
			res.json(roles);
		}
	})
}

roleController.getRoleById = function(req, res){
	roleController.getSingleRoleByQuery({_id:req.params.id}).exec(function(err, role){

		if(!role) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

		if (err)
		{
			res.error(err);
		} 
		else 
		{
			res.json(role);
		}
	});
}

roleController.createRole = function(req, res) {
	var role = new Roles({
		name: req.body.name
	});	

    role.save(function (err) {
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

roleController.updateRole = function(req, res) {
	Roles.findById(req.params.id, function (err, role) {
        if(!role) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        role.name = req.body.name === undefined ? role.name : req.body.name;

        return role.save(function (err) {
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

roleController.deleteRole = function(req, res) {
	Roles.findById(req.params.id, function (err, role) {
        if(!role) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return role.remove(function (err) {
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

module.exports = roleController;

