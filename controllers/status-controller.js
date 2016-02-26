var Statuses = require('../models/statuses');
var statusController = {};

statusController.getAllQuery = function() {
   	return  Statuses.find({});
}

statusController.getByQuery = function(query) {
	return Statuses.findOne(query);
}

statusController.getAll = function(req, res) {
		statusController.getAllQuery().exec(function(err, statuses){
		if (err){
				res.error(err);
		} else {
			res.json(statuses);
		}
	})
}

statusController.getById = function(req, res){
	statusController.getByQuery({_id:req.params.id}).exec(function(err, status){

		if(!status) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

		if (err)
		{
			res.error(err);
		} 
		else 
		{
			res.json(status);
		}
	});
}

statusController.create = function(req, res) {
	var status = new Statuses({
		name: req.body.name
	});	

    status.save(function (err) {
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

statusController.update = function(req, res) {
	Statuses.findById(req.params.id, function (err, status) {
        if(!status) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        status.name = req.body.name === undefined ? status.name : req.body.name;

        return status.save(function (err) {
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

statusController.delete = function(req, res) {
	Statuses.findById(req.params.id, function (err, status) {
        if(!status) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return status.remove(function (err) {
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

module.exports = statusController;

