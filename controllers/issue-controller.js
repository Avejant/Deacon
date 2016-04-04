var Issues = require('../models/issues');
var Projects = require('./project-controller');
var IssueTypes = require('./issueType-controller');
var Severities = require('./severity-controller');
var Statuses = require('./status-controller');
var Users = require('./user-controller');

var issueController = {};

issueController.getAllQuery = function() {
   	return  Issues.find({}).populate('issueType').populate('severity').populate('status').populate('project').populate('assigneeUser').populate('reporter').populate('issueType');
}

issueController.getByQuery = function(query) {
	return Issues.find(query).populate('issueType').populate('severity').populate('status').populate('project').populate('assigneeUser').populate('reporter').populate('issueType');
}

issueController.getSingleByQuery = function(query) {
    return Issues.findOne(query).populate('issueType').populate('severity').populate('status').populate('project').populate('assigneeUser').populate('reporter').populate('issueType');
}

issueController.getAll = function(req, res) {
		issueController.getAllQuery().exec(function(err, issues){
		if (err){
				res.error(err);
		} else {
			res.json(issues);
		}
	})
}

issueController.getAllIssuesByProjectId = function(req, res) {
    Projects.getByQuery({_id:req.params.id}).exec(function(err, _project){
        issueController.getByQuery({project:_project._id}).exec(function(err, issues){
        if (err){
                res.error(err);
        } else {
            res.json(issues);
        }
    });  
    });
}

issueController.getById = function(req, res){
	issueController.getSingleByQuery({_id:req.params.id}).exec(function(err, issue){

		if(!issue) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

		if (err)
		{
			res.error(err);
		} 
		else 
		{
			res.json(issue);
		}
	});
}

issueController.create = function(req, res) {
Statuses.getByQuery({name:'Open'}).exec(function(err, status){
    if (!status) 
    {
        res.send({error:'Status not found'});
    }

    var issue = new Issues({
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        project: req.body.project._id,
        issueType: req.body.issueType._id,
        severity: req.body.severity._id,
        status: status._id,
        assigneeUser: req.body.assigneeUser._id,
        reporter: req.body.reporter._id
    }); 

    issue.save(function (err) {
        if (!err) {
            return res.send();
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

issueController.update = function(req, res) {
    Issues.findById(req.params.id, function (err, issue) {

        if(!issue) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        issue.name = req.body.name;
        issue.description = req.body.description;
        issue.updatedAt = new Date();
        issue.issueType = req.body.issueType._id;
        issue.severity = req.body.severity._id;
        issue.assigneeUser = req.body.assigneeUser._id;

        return issue.save(function (err) {
            if (!err) {
                return res.send();
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

issueController.delete = function(req, res) {
	Issues.findById(req.params.id, function (err, issue) {
        if(!issue) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return issue.remove(function (err) {
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

issueController.updateStatus = function(req, res) {
    Issues.findById(req.params.id, function (err, issue) {
    Statuses.getByQuery({name:req.body.statusName}).exec(function(err, status) {
        if(!issue) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        issue.status = status;
        issue.updatedAt = new Date();

        return issue.save(function (err) {
            if (!err) {
                return res.send();
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
      })
    });
}


module.exports = issueController;

