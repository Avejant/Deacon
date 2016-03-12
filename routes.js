module.exports = function(app, passport) {
var path = require('path');
var Role = require(path.join(__dirname, 'models/roles'));
var Roles = require('./controllers/role-controller');

app.get('/', function (req, res) {
    res.render('index', { isAuthenticated : req.isAuthenticated(), user : req.user });
});

app.get('/currentUser', function(req, res) {
  res.json({ isAuthenticated : req.isAuthenticated(), user : req.user });
});

app.get('/login', function(req, res) {
    var messages = req.flash('loginMessage');
    res.json({ isMessageNotEmpty : messages.length > 0, message: messages });
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
    if (!user) { return res.send({messages:req.flash('loginMessage')}) }
    req.login(user, function(err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      return res.send();
    });
  })(req, res, next);
});

app.get('/signup', function(req, res) {
    Roles.getAllQuery().exec(function(err, roles) {
        res.send({roles:roles});
    });
});

app.get('/roles', Roles.getAll);
app.get('/roles/:id', Roles.getById);
app.post('/roles', Roles.create);
app.put('/roles/:id', Roles.update);
app.delete('/roles/:id', Roles.delete);

app.post('/signup', function(req, res, next) {
/*  if (req.body.username === '') {
    req.flash('registerMessage','Fill username field');
    res.redirect('/signup');
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
  }*/

  passport.authenticate('local-signup', function(err, user, info) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { return res.send({messages:req.flash('registerMessage')}); }
    req.login(user, function(err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      return res.send();
    });
  })(req, res, next);
});
};
