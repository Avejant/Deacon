var Issues = require('../models/issues');
var Projects = require('./project-controller');
var IssueTypes = require('./issueType-controller');
var Severities = require('./severity-controller');
var Statuses = require('./status-controller');
var Users = require('./user-controller');

var issueController = {};

issueController.getAllQuery = function() {
   	return  Issues.find({});
}

issueController.getByQuery = function(query) {
	return Issues.findOne(query);
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

issueController.getById = function(req, res){
	issueController.getByQuery({_id:req.params.id}).exec(function(err, issue){

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

/*issueController.createIssue = function(req, res) {
Users.getAllUsersQuery().exec(function(err, users) {
Projects.getProjectByQuery({name:req.body.projectName}).exec(function(err, project) {
    if (!project) 
    {
        res.send({error:'Project not found'});
    }
IssueTypes.getIssueByQuery()
    var issue = new Issues({
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        project: project._id,
        issueType: issueType._id,
        severity: severity._id,
        status: status._id,
        assigneeUser: assigneeUser._id,
        reporter: reporter._id
    }); 

    issue.save(function (err) {
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
});
	
}

issueController.updateIssue = function(req, res) {
	Issues.findById(req.params.id, function (err, issue) {
        if(!issue) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        issue.name = req.body.name === undefined ? issue.name : req.body.name;

        return issue.save(function (err) {
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
}*/

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

module.exports = issueController;

