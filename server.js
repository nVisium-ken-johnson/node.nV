
var express 	= require('express');
var cookieParser = require('cookie-parser')
var app         = express();
var bodyParser = require('body-parser')
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport 	= require('passport');
var LocalStrategy = require('passport-local').Strategy;
var config = require('./config'); // get our config file
var user   = require('./app/models/user'); // get our mongoose model
var userroutes = require('./app/routes/userRoutes.js');
var employerroutes = require('./app/routes/employerRoutes.js');
var employeeRoutes = require('./app/routes/employeeRoutes.js');
var adminRoutes = require('./app/routes/adminRoutes.js');
var authService = require('./app/services/authService.js');
var session = require('express-session');
var flash = require('connect-flash');

var UIRoutes = require('./app/routes/UIRoutes.js');

var port = process.env.PORT || 8081; 
mongoose.Promise = require('bluebird');
mongoose.connect(config.database); // connect to database
app.use(morgan('dev'));

// Passport
// passport config
var User = require('./app/models/user');
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(session({
        secret: 'the princess and the frog',
        saveUninitialized: true,
        resave: true
    }));
app.use(passport.initialize());
app.use(passport.session());
app.set('superSecret', config.secret);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});

app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/homepage');
});


// Pull in the public directory
app.use('/public', express.static(__dirname + '/public'));

// Set Views folder
var eeViewPath=__dirname + '/views/ee';
var erViewPath=__dirname + '/views/er';
var adminViewPath=__dirname + '/views/admin';
var publicViewPath=__dirname + '/views';

app.set('views', [publicViewPath,eeViewPath,erViewPath,adminViewPath]); 

// Routes ===============
//Static Content Routing

//TEST ROUTE ONLY
app.get('/setup',userroutes.setup);


app.get('/',UIRoutes.index);
app.get('/login',UIRoutes.login);
app.post('/register', UIRoutes.register);


//app.post('/api/createEmployee',userroutes.createEmployee); TEST ONLY
//app.post('/api/createEmployer',userroutes.createEmployer); TEST ONLY
//app.post('/api/createAdmin',userroutes.createAdmin); TEST ONLY
  
  
app.get('/logout',userroutes.logout);
//app.post('/api/authenticate',userroutes.login);


app.get('/api/getPublicUsers',userroutes.getPublicUsers); //TEST ONLY
//app.get('/api/getUserById',userroutes.getUserById); TEST ONLY
//User Routes
//app.get('/api/getPublicUsers',userroutes.getPublicUsers);
//app.get('/api/getProfile',userroutes.getProfile);


app.get('/homepage',UIRoutes.homepage);
app.get('/settings',UIRoutes.settings);
app.get('/listings',UIRoutes.listings);
app.get('/createListing',UIRoutes.createListing);
app.get('/search',UIRoutes.search);
app.get('/jobs',UIRoutes.jobs);
app.get('/funds',UIRoutes.funds);
app.get('/review',UIRoutes.review);

app.get('/editListing',UIRoutes.editListing);


//Admin UI Routes
app.get('/ee',UIRoutes.ee);
app.get('/er',UIRoutes.er);
app.get('/ping',UIRoutes.ping);
app.get('/create',UIRoutes.create);
//Employer Routes
app.post('/api/employer/editListing',authService.isER,employerroutes.updateListing);
app.post('/api/employer/createListing',authService.isER,employerroutes.createListing); //Need to customize
app.get('/api/employer/getListings',authService.isER,employerroutes.getListings);
app.post('/api/employer/updateEmployer',authService.isER,employerroutes.updateEmployer); //TODO;
app.get('/api/employer/acceptForOffer',authService.isER,employerroutes.acceptForOffer);
app.get('/api/employer/acceptForInterview',authService.isER,employerroutes.acceptForInterview);
app.get('/api/employer/rejectApplication',authService.isER,employerroutes.rejectApplication);
app.post('/api/employer/editListing',authService.isER,employerroutes.editListing);
app.get('/api/employer/followEmployee',authService.isER,employerroutes.followEmployee);
app.get('/api/employer/search',authService.isER,employerroutes.search);
app.get('/api/employer/getRequestedEmployees',authService.isER,employerroutes.getRequestedEmployees);
app.delete('/api/employer/deleteRequestedApplication',authService.isER,employerroutes.deleteRequestedApplication);

//Employee Routes

app.get('/apply', employeeRoutes.apply);

app.post('/api/employee/updateEmployee',authService.isEE,employeeRoutes.updateEmployee);
app.get('/api/employee/applyForJob',authService.isEE,employeeRoutes.applyForJob);
app.get('/api/employee/listInterviews',authService.isEE,employeeRoutes.listInterviews);
app.get('/api/employee/listOffers',authService.isEE,employeeRoutes.listOffers);
app.get('/api/employee/listSentApplications',authService.isEE,employeeRoutes.listSentApplications);
//app.get('/api/employee/getListings',authService.isEE,employeeRoutes.getListings);
//app.get('/api/employee/upgradeToPremium',authService.isEE,employeeRoutes.employeeUpgradeToPremium);
//app.post('/api/employee/writeReview',authService.isEE,employeeRoutes.writeReview);
//app.post('/api/employee/followEmployer',authService.isEE,employeeRoutes.followEmployer);


//Payment Route

app.post('/api/upgrade',userroutes.upgrade);

//Admin Routes

app.post('/api/admin/createUser',authService.isAdmin,adminRoutes.createUser);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);