var Severities = require('../models/severities');
var severityController = {};

severityController.getAllQuery = function() {
    return Severities.find({});
}

severityController.getByQuery = function(query) {
    return Severities.findOne(query);
}

severityController.getAll = function(req, res) {
    severityController.getAllQuery().exec(function(err, severities) {
        if (err) {
            res.error(err);
        } else {
            res.json(severities);
        }
    })
}

severityController.getById = function(req, res) {
    severityController.getByQuery({
        _id: req.params.id
    }).exec(function(err, severity) {

        if (!severity) {
            res.statusCode = 404;
            return res.send({
                error: 'Not found'
            });
        }

        if (err) {
            res.error(err);
        } else {
            res.json(severity);
        }
    });
}

severityController.create = function(req, res) {
    var severity = new Severities({
        name: req.body.name
    });

    severity.save(function(err) {
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

severityController.update = function(req, res) {
    Severities.findById(req.params.id, function(err, severity) {
        if (!severity) {
            res.statusCode = 404;
            return res.send({
                error: 'Not found'
            });
        }

        severity.name = req.body.name === undefined ? severity.name : req.body.name;

        return severity.save(function(err) {
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

severityController.delete = function(req, res) {
    Severities.findById(req.params.id, function(err, severity) {
        if (!severity) {
            res.statusCode = 404;
            return res.send({
                error: 'Not found'
            });
        }
        return severity.remove(function(err) {
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

module.exports = severityController;
