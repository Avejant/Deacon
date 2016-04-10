module.exports = function(app, passport) {
var Projects = require('../controllers/project-controller');
var Comments = require('../controllers/comment-controller');
var IssueTypes = require('../controllers/issueType-controller');
var Severities = require('../controllers/severity-controller');
var Statuses = require('../controllers/status-controller');
var Issues = require('../controllers/issue-controller');
var Users = require('../controllers/user-controller');
var Upload = require('../controllers/upload-controller');

  app.get('/api/projects', Projects.getAll);
  app.get('/api/projects/:id', Projects.getById);
  app.post('/api/projects', Projects.create);
  app.put('/api/projects/:id', Projects.update);
  app.delete('/api/projects/:id', Projects.delete);

  app.get('/api/comments', Comments.getAll);
  app.get('/api/comments/:id', Comments.getById);
  app.post('/api/comments', Comments.create);
  app.put('/api/comments/:id', Comments.update);
  app.delete('/api/comments/:id', Comments.delete);

  app.get('/api/issueTypes', IssueTypes.getAll);
  app.get('/api/issueTypes/:id', IssueTypes.getById);
  app.post('/api/issueTypes', IssueTypes.create);
  app.put('/api/issueTypes/:id', IssueTypes.update);
  app.delete('/api/issueTypes/:id', IssueTypes.delete);

  app.get('/api/severities', Severities.getAll);
  app.get('/api/severities/:id', Severities.getById);
  app.post('/api/severities', Severities.create);
  app.put('/api/severities/:id', Severities.update);
  app.delete('/api/severities/:id', Severities.delete);

  app.get('/api/statuses', Statuses.getAll);
  app.get('/api/statuses/:id', Statuses.getById);
  app.post('/api/statuses', Statuses.create);
  app.put('/api/statuses/:id', Statuses.update);
  app.delete('/api/statuses/:id', Statuses.delete);

  app.get('/api/issues', Issues.getAll);
  app.get('/api/issues/:id', Issues.getById);
  app.get('/api/issuesOfProject/:id', Issues.getAllIssuesByProjectId);
  app.post('/api/issues', Issues.create);
  app.put('/api/issues/:id', Issues.update);
  app.put('/api/issues/:id/updateStatus', Issues.updateStatus);
  app.delete('/api/issues/:id', Issues.delete);
  app.post('/api/attachments/:id', Issues.attach);

  app.get('/api/users', Users.getAll);
  app.get('/api/users/:id', Users.getById);

  //upload routes
/*  app.get('/api/upload/:filename', Upload.read);*/
  app.post('/api/upload', Upload.create);
  app.post('/api/upload/avatar', Upload.avatarUpload);
  app.get('/api/download/:filename', Upload.download);
};
