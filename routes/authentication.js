module.exports = function(app, passport) {
    var path = require('path');
    var Roles = require(path.join(__dirname,'../controllers/role-controller'));
    var Role = require(path.join(__dirname, '../models/roles'));


    app.get('/', function(req, res) {
        res.render('index', {
            statusCode: 200,
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    });

    app.get('/currentUser', function(req, res) {
        res.json({
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    });

    app.get('/login', function(req, res) {
        var messages = req.flash('loginMessage');
        res.json({
            isMessageNotEmpty: messages.length > 0,
            message: messages
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return next(err);
            }
            // Redirect if it fails
            if (!user) {
                return res.send({
                    messages: req.flash('loginMessage')
                })
            }
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }
                // Redirect if it succeeds
                return res.send();
            });
        })(req, res, next);
    });

    app.get('/signup', function(req, res) {
        Roles.getAllQuery().exec(function(err, roles) {
            res.send({
                roles: roles
            });
        });
    });



    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) {
                return next(err);
            }
            // Redirect if it fails
            if (!user) {
                return res.send({
                    messages: req.flash('registerMessage')
                });
            }
            return res.send();
        })(req, res, next);
    });
};
