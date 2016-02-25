module.exports = function(app, passport) {
var Projects = require('../controllers/project-controller');

  app.get('/api/projects', Projects.getAllProjects);
  app.get('/api/projects/:id', Projects.getProjectById);
  app.post('/api/projects', Projects.createProject);
  app.put('/api/projects/:id', Projects.updateProject);
  app.delete('/api/projects/:id', Projects.deleteProject);

};
