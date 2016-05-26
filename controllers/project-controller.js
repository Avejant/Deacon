var Projects = require('../models/projects');
var Users = require('./user-controller');
var Sprints = require('../models/sprints');

var projectController = {};

projectController.getAllQuery = function() {
    return Projects.find({}).populate('projectManager').populate('sprints');
}

projectController.getByQuery = function(query) {
    return Projects.findOne(query).populate('projectManager').populate('sprints');
}

projectController.getByIdQuery = function functionName(id) {
    return Projects.findById(id).populate('projectManager').populate('sprints');
}

projectController.getAll = function(req, res) {
    projectController.getAllQuery().exec(function(err, projects) {


        if (err) {
            res.error(err);
        } else {
            res.json(projects);
        }
    })
}

projectController.getById = function(req, res) {
    projectController.getByQuery({
        _id: req.params.id
    }).exec(function(err, project) {
        if (!project) {
            res.statusCode = 404;
            return res.send({
                error: 'Not found'
            });
        }

        if (err) {
            res.error(err);
        } else {
            res.json(project);
        }
    });
}

projectController.create = function(req, res) {
    Projects.findOne({
        $or: [{
            name: req.body.name
        }, {
            shortName: req.body.shortName
        }]
    }, function(err, project) {
        if (project) {
            return res.send({
                nameError: project.name === req.body.name,
                shortNameError: project.shortName === req.body.shortName
            });
        }
        var project = new Projects({
            name: req.body.name,
            shortName: req.body.shortName,
            projectManager: req.body.projectManager._id
        });

        project.save(function(err) {
            if (!err) {
                return res.send();
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

projectController.update = function(req, res) {
    Users.getByQuery({
        name: req.param.username
    }).exec(function(err, user) {
        if (!user) {
            res.send({
                error: "User not found"
            });
        }
        Projects.findById(req.params.id, function(err, project) {
            if (!project) {
                res.statusCode = 404;
                return res.send({
                    error: 'Not found'
                });
            }
            Projects.findOne({
                $and: [{
                    $or: [{
                        name: req.body.name
                    }, {
                        shortName: req.body.shortName
                    }]
                }, {
                    _id: {
                        $ne: project._id
                    }
                }]
            }, function(err, sameProject) {
                if (sameProject) {
                    console.log("ADADA");
                    return res.send({
                        nameError: sameProject.name === req.body.name,
                        shortNameError: sameProject.shortName === req.body.shortName
                    });
                }
                project.name = req.body.name === undefined ? project.name : req.body.name;
                project.shortName = req.body.shortName === undefined ? project.shortName : req.body.shortName;
                project.projectManager = user._id;

                return project.save(function(err) {
                    if (!err) {
                        return res.send();
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
        });
    });
}

projectController.addSprint = function(projectId, sprintId) {
    Projects.findByIdAndUpdate(projectId, {
            $push: {
                "sprints": {
                    "_id": sprintId
                }
            }
        }, {
            safe: true
        },
        function(err, project) {
        }
        );
    }


projectController.delete = function(req, res) {
    Projects.findById(req.params.id, function(err, project) {
        if (!project) {
            res.statusCode = 404;
            return res.send({
                error: 'Not found'
            });
        }
        return project.remove(function(err) {
            if (!err) {
                return res.send();
            } else {
                res.statusCode = 500;
                return res.send({
                    error: 'Server error'
                });
            }
        });
    });
}

module.exports = projectController;
