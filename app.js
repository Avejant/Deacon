var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
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



app.engine('handlebars', exphbs({defaultLayout: 'main'}));

//configure

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
mongoose.connect(configDB.url);

//use middlewares

app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

require(path.join(__dirname, 'configs/passport'))(passport); 
//routes
require(path.join(__dirname, 'routes.js'))(app, passport);

//run server
app.listen(port, function() {
	console.log("Some magic on " + port);
});