module.exports = function(app, passport) {
var path = require('path');
var Role = require(path.join(__dirname, 'models/roles'));
var Roles = require('./controllers/role-controller');

app.get('/', function (req, res) {
    res.render('index', { isAuthenticated : req.isAuthenticated(), user : req.user });
});

app.get('/login', function(req, res) {
    var messages = req.flash('loginMessage');
    console.log(messages);
    res.render('login', { isMessageNotEmpty : messages.length > 0, message: messages });
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/login', function(req, res, next) {
  if (req.body.username === '') {
    req.flash('loginMessage','Fill username field');
    res.redirect('/login');
  }

  if (req.body.password === '') {
    req.flash('loginMessage','Fill password field');
    res.redirect('/login');
  }

  passport.authenticate('local-login', function(err, user, info) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { return res.redirect('/login'); }
    req.login(user, function(err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/register', function(req, res) {
    var messages = req.flash('registerMessage');
    Roles.getAllRolesQuery().exec(function(err, roles) {
        if (err) throw err;
        console.log(roles);
        res.render('register', { isMessageNotEmpty : messages.length > 0, message: messages, roles: roles });
    });
});

app.get('/roles', Roles.getAll);
app.get('/roles/:id', Roles.getById);
app.post('/roles', Roles.create);
app.put('/roles/:id', Roles.update);
app.delete('/roles/:id', Roles.delete);

app.post('/register', function(req, res, next) {
  if (req.body.username === '') {
    req.flash('registerMessage','Fill username field');
    res.redirect('/register');
  }

  if (req.body.password === '') {
    req.flash('registerMessage','Fill password field');
    res.redirect('/register');
  }

  if(req.body.passwordConfirmation === ''){
    req.flash('registerMessage','Confirm password');
    res.redirect('/register');
  }

  if (req.body.password !== req.body.passwordConfirmation) {
    req.flash('registerMessage','Password and confirmation are different!');
    res.redirect('/register');
  }

  if(req.body.email === ''){
    req.flash('registerMessage','Fill email field');
    res.redirect('/register');
  }

  passport.authenticate('local-signup', function(err, user, info) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { return res.redirect('/register'); }
    req.login(user, function(err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      return res.redirect('/');
    });
  })(req, res, next);
});
};
