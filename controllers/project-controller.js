var Projects = require('../models/projects');
var Users = require('./user-controller');
var projectController = {};

projectController.getAllQuery = function() {
   	return  Projects.find({});
}

projectController.getByQuery = function(query) {
	return Projects.findOne(query);
}

projectController.getAll = function(req, res) {
		projectController.getAllQuery().exec(function(err, projects){
		if (err){
				res.error(err);
		} else {
			res.json(projects);
		}
	})
}

projectController.getById = function(req, res){
	projectController.getByQuery({_id:req.params.id}).exec(function(err, project){
		if(!project) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

		if (err)
		{
			res.error(err);
		} 
		else 
		{
			res.json(project);
		}
	});
}

projectController.create = function(req, res) {
	Users.getByQuery({name:req.param.username}).exec(function(err,user){
		if (!user) 
		{
			res.send({error:"User not found"});
		}

		var project = new Projects({
			name: req.body.name,
			shortName: req.body.shortName,
			projectManager: user._id
		});	

    	project.save(function (err) {
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
	});
}

projectController.update = function(req, res) {
	Users.getByQuery({name:req.param.username}).exec(function(err,user){
		if (!user) 
		{
			res.send({error:"User not found"});
		}
	Projects.findById(req.params.id, function (err, project) {
        if(!project) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        project.name = req.body.name === undefined ? project.name : req.body.name;
        project.shortName = req.body.shortName === undefined ? project.shortName : req.body.shortName;
        project.projectManager = user._id;

        return project.save(function (err) {
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
   });
}

projectController.delete = function(req, res) {
	Projects.findById(req.params.id, function (err, project) {
        if(!project) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return project.remove(function (err) {
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

module.exports = projectController;