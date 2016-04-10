var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var Issue = new Schema({
	name:String,
	description: String,
	project: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
	},
	issueType: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'IssueType'
	},
	severity: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Severity'
	},
	status: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Status'
	},
	assigneeUser: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
	},
	reporter: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
	},
	watchers: [{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
	}],
	createdAt: Date,
	updatedAt: Date,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
	}],
	attachments: [String]
});

Issue.plugin(deepPopulate);
module.exports = mongoose.model('Issue', Issue);