module.exports = function(app, passport) {
var path = require('path');
var Role = require(path.join(__dirname, 'models/roles'));

app.get('/', function (req, res) {
    console.log(req.user);
    res.render('home', { isAuthenticated : req.isAuthenticated(), user : req.user });
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
    Role.find({}, function(err, roles) {
        if (err) throw err;
        console.log(roles);
        res.render('register', { isMessageNotEmpty : messages.length > 0, message: messages, roles: roles });
    });
});

/*app.get('/roles',function(req, res, next){
  var admin = new Role({
    name: "admin"
  });

    var d = new Role({
    name: "devlead"
  });
      var regular = new Role({
    name: "regular"
  });

      admin.save();
      d.save();
      regular.save();
      res.redirect('/');
});
*/

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
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}