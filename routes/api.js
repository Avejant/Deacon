module.exports = function(app, passport) {
var Projects = require('../controllers/project-controller');
var Comments = require('../controllers/comment-controller');
var IssueTypes = require('../controllers/issueType-controller');
var Severities = require('../controllers/severity-controller');
var Statuses = require('../controllers/status-controller');

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
};
