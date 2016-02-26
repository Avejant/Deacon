var IssueTypes = require('../models/issueTypes');
var typesController = {};

typesController.getAllQuery = function() {
   	return  IssueTypes.find({});
}

typesController.getByQuery = function(query) {
	return IssueTypes.findOne(query);
}

typesController.getAll = function(req, res) {
		typesController.getAllIssueTypesQuery().exec(function(err, issueTypes){
		if (err){
				res.error(err);
		} else {
			res.json(issueTypes);
		}
	})
}

typesController.getById = function(req, res){
	typesController.getSingleIssueTypeByQuery({_id:req.params.id}).exec(function(err, issueType){

		if(!issueType) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

		if (err)
		{
			res.error(err);
		} 
		else 
		{
			res.json(issueType);
		}
	});
}

typesController.create = function(req, res) {
	var issueType = new IssueTypes({
		name: req.body.name
	});	

    issueType.save(function (err) {
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

typesController.update = function(req, res) {
	IssueTypes.findById(req.params.id, function (err, issueType) {
        if(!issueType) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        issueType.name = req.body.name === undefined ? issueType.name : req.body.name;

        return issueType.save(function (err) {
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

typesController.delete = function(req, res) {
	IssueTypes.findById(req.params.id, function (err, issueType) {
        if(!issueType) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return issueType.remove(function (err) {
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

module.exports = typesController;

