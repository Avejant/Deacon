var Roles = require('../models/roles');
var roleController = {};

roleController.getAllQuery = function() {
    return Roles.find({});
}

roleController.getByQuery = function(query) {
    return Roles.findOne(query);
}

roleController.getAll = function(req, res) {
    roleController.getAllQuery().exec(function(err, roles) {
        if (err) {
            res.error(err);
        } else {
            res.json(roles);
        }
    })
}

roleController.getById = function(req, res) {
    roleController.getByQuery({
        _id: req.params.id
    }).exec(function(err, role) {

        if (!role) {
            res.statusCode = 404;
            return res.send({
                error: 'Not found'
            });
        }

        if (err) {
            res.error(err);
        } else {
            res.json(role);
        }
    });
}

roleController.create = function(req, res) {
    var role = new Roles({
        name: req.body.name
    });

    role.save(function(err) {
        if (!err) {
            return res.redirect('/');
        } else {
            if (err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({
                    error: 'Validation error'
                });
            } else {
                res.statusCode = 500;
                res.send({
                    error: 'Server error'
                });
            }
        }
    });
}

roleController.update = function(req, res) {
    Roles.findById(req.params.id, function(err, role) {
        if (!role) {
            res.statusCode = 404;
            return res.send({
                error: 'Not found'
            });
        }

        role.name = req.body.name === undefined ? role.name : req.body.name;

        return role.save(function(err) {
            if (!err) {
                return res.redirect('/');
            } else {
                if (err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({
                        error: 'Validation error'
                    });
                } else {
                    res.statusCode = 500;
                    res.send({
                        error: 'Server error'
                    });
                }
            }
        });
    });
}

roleController.delete = function(req, res) {
    Roles.findById(req.params.id, function(err, role) {
        if (!role) {
            res.statusCode = 404;
            return res.send({
                error: 'Not found'
            });
        }
        return role.remove(function(err) {
            if (!err) {
                return res.redirect('/');
            } else {
                res.statusCode = 500;
                return res.send({
                    error: 'Server error'
                });
            }
        });
    });
}

module.exports = roleController;
