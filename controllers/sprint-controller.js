var Sprints = require('../models/sprints');
var Projects = require('./project-controller');
var sprintController = {};

sprintController.getAllQuery = function() {
    return Sprints.find({});
}

sprintController.getByQuery = function(query) {
    return Sprints.findOne(query);
}

sprintController.create = function(req, res) {
    var sprint = new Sprints({
        name: req.body.name,
        beginning: req.body.beginning,
        ending: req.body.ending
    });

    sprint.save(function(err) {
        if (!err) {
            Projects.addSprint(req.params.id, sprint._id);
            Projects.getByIdQuery(req.params.id).exec(function(err, project) {
                if (project.sprints.length > 1) {
                  var currentSprint = project.sprints[project.sprints.length-2];
                  currentSprint.active = false;
                  return currentSprint.save(function(err) {
                    if (err) {
                      res.send({error:err});
                    }
                    res.send();
                  });
                }

                res.send();
            });

        } else {
            res.send({
                error: err
            })
        }
    });
}

module.exports = sprintController;
