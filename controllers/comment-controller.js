var Comments = require('../models/comments');
var Users = require('./user-controller');
var Issues = require('./issue-controller');
var commentController = {};

commentController.getAllQuery = function() {
   	return  Comments.find({});
}

commentController.getByQuery = function(query) {
	return Comments.findOne(query);
}

commentController.getAll = function(req, res) {
		commentController.getAllQuery().exec(function(err, comments){
		if (err){
				res.error(err);
		} else {
			res.json(comments);
		}
	})
}

commentController.getById = function(req, res){
	commentController.getByQuery({_id:req.params.id}).exec(function(err, comment){
		if(!comment) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

		if (err)
		{
			res.error(err);
		} 
		else 
		{
			res.json(comment);
		}
	});
}


commentController.create = function(req, res) {
        Users.getByQuery({_id:req.body.userId}).exec(function(err,user){
        if (!user) 
        {
            res.send({error:"User not found"});
        }

        var comment = new Comments({
            text: req.body.content,
            createdAt: new Date(),
            author: user._id
        }); 

        comment.save(function (err) {
            if (!err) {
                Issues.addComment(req.body.issueId, comment._id);
                res.send();
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

commentController.update = function(req, res) {
    Users.getByQuery({name:req.param.username}).exec(function(err,user){
        if (!user) 
        {
            res.send({error:"User not found"});
        }
    Comments.findById(req.params.id, function (err, comment) {
        if(!comment) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        comment.text = req.body.content;
        comment.author = user._id;

        return comment.save(function (err) {
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

commentController.delete = function(req, res) {
	Comments.findById(req.params.id, function (err, comment) {
        if(!comment) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return comment.remove(function (err) {
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

module.exports = commentController;

