var app= express();
var cookieparser= require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var localstrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var {hash,compare}= require('./hashing.js');
var {findbyno,save , updateuser,generateotp,matchotp} = require('./db.js');
var {createrequest, createorder, removerequest,removeorder}= require('./instamojo.js');
var {adminmake,adminusername,adminpassword} = require('./schema/adminschema.js');
var client = require('twilio')('ACaeccbfb42136c3b6304f239089a6f8b1','f4856e3cd532ae3cbb3cda166a356f0b');
app.set('view engine','ejs');
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));
app.use(cookieparser());

//middleware for session
app.use(session(
	{
		secret:'secret',
	    saveUninitialized:true,
		resave:true
	}));
//middleware for passport
app.use(passport.initialize());
app.use(passport.session());
//connect flash for flashing messages
app.use(flash());
//serializing user
passport.serializeUser(function(user,done){
	console.log('in the ');
    done(null,user._id);
});
var loggedin=function(req,res,next){

  if(req.user.no)
  	next();
  else
  	res.redirect('/login');
};
//deserializing user
passport.deserializeUser(function(id,done){
	console.log(' deesess');
	findbyid(id,function(err,user){
       done(err,user);
	});
});