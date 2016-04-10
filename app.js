var express = require('express');
var path = require('path');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;
var User = require(path.join(__dirname, 'models/users'));
var configDB = require(path.join(__dirname, 'configs/database'));
var port = process.env.PORT || 1337;

var app = express();

//configure

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
mongoose.connect(configDB.url);

//use middlewares
app.use('/app', express.static(__dirname + '/views/scripts'));
app.use('/storage', express.static(__dirname + '/uploads'));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

require(path.join(__dirname, 'configs/passport'))(passport); 
//routes
require(path.join(__dirname, 'routes.js'))(app, passport);
require(path.join(__dirname, 'routes/api.js'))(app, passport);
//run server
app.listen(port, function() {
	console.log("Some magic on " + port);
});