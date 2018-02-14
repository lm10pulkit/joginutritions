var express = require('express');
var app= express();
var mongoose= require('mongoose');
var bodyParser = require('body-parser');
var cookieparser= require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var localstrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var {hash,compare}= require('./hashing.js');
var {adminmake, adminusername,adminpassword,addproduct,allproduct,editproduct,updatephoto,
	deleteproduct,findproduct,allmessages,deletemessage,adminid,saveadmin,adminemail,admincheck,
allproduct}= require('./admindb.js');
var uploadphoto = require('./cloudinary.js');
var {processword,find}= require('./search.js');
app.set('view engine','ejs');
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));
app.use(cookieparser());
var sendmail= require('./mail.js');
var MongoStore = require('connect-mongo')(session);
 const port = process.env.PORT||8080;
//middleware for session
app.use(session(
	{
		secret:'secret',
	    saveUninitialized:true,
		resave:true,
		store : new MongoStore({mongooseConnection:mongoose.connection})
	}));
//middleware for passport
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
//connect flash for flashing messages
app.use(flash());
//serializing user
passport.serializeUser(function(user,done){
	var obj = {};
	obj.id = user._id;
	if(user.admin){
		 obj.admin =user.admin;
           done(null,obj);
	}
	else{
      
	}
});
var onetime = function(req,res,next){
   admincheck(function(check){
     if(check)
     	next();
     else
     	 res.redirect('/adminlogin');
   });
};
var adminloggedin=function(req,res,next){
    if(req.user){
       if(req.user.admin){
            next();
       }
       else
       	res.redirect('/adminlogin');
    }
    else{
      res.redirect('/adminlogin');
    }
  
};
//deserializing user
passport.deserializeUser(function(obj,done){
	 var admin = obj.admin;

	 if(admin){

      var  id = obj.id;
      adminid(id,function(err,data){
           done(null,data);
      });

	 }
	 else{
     
	 }
});
passport.use('admin',new localstrategy({
usernameField :'username',
passwordField : 'password',
passReqToCallback:true
},function(req,username,password,done){
       adminmake(username,function(err,data){
             if(!data){
                  done(err,false);
             }
             else{
             	compare(password,data.password,function(err,check){
                    if(err)
                    	throw err;
                      if(check){
                      	 console.log('passed');
                          done(null,data);
                      }
                      else{
                           done(null,false);
                      }
             	});    
             }
       });    
}));
var hashpassword = function(req,res,next){
    var password = req.body.password;
    hash(password,function(err,hash){
            req.body.password=hash;
            next();
    });
};
app.get('/',function(req,res){
  res.redirect('/adminsignup');
});
app.get('/adminsignup',onetime,function(req,res){
   res.render('adminsignup');
});
app.post('/adminsignup',hashpassword,function(req,res){
    saveadmin(req.body, function(err,data){
    	if(data){
             sendmail(data.email,'admin signup for jogi nutritions',' you have signuped for jogi nutritions as an admin',function(err,data){
                 console.log(data);
             });
          res.redirect('adminlogin');
    	}
    });
});
app.get('/adminlogin',function(req,res){
    res.render('loginadmin');
});
app.post('/adminlogin',passport.authenticate('admin',{failureRedirect:'/adminlogin'}),function(req,res){
    res.redirect('/addproduct');
});
app.get('/addproduct',adminloggedin,function(req,res){
  res.render('addproduct');
});
app.post('/addproduct',adminloggedin,function(req,res){
    var body = req.body;
    uploadphoto(body.imageurl,function(result){
        body.imageurl = result.secure_url;
        addproduct(body,function(err,data){
        	if(err)
        		console.log(err);
           console.log(data);
        });
    });
    res.redirect('/addproduct');
});
app.get('/myproduct',adminloggedin,function(req,res){
     allproduct(function(err,data){
         res.render('myproduct',{data:data});
     }); 
});
app.post('/editproduct',adminloggedin,function(req,res){
var id = req.query.id;
var body = req.body;
editproduct(id.toString(),body,function(err,data){
   console.log(data);
});
res.redirect('/addproduct');
});
app.get('/edit/:id', adminloggedin,function(req,res){
    var id = req.params.id;
    id=id.toString();
    findproduct(id,function(err,data){
        res.render('editproduct',{data:data});
    });
});
app.get('/deleteproduct/:id',adminloggedin,function(req,res){
     var id = req.params.id;
     deleteproduct(id.toString(),function(err,data){
            console.log(data);
     });
     res.redirect('/myproduct');
});
//message app
app.get('/mymessage',adminloggedin, function(req,res){
   allmessages(function(err,data){
        res.render('mymessage',{message:data});
   });   
});
app.get('/deletemessage/:id',adminloggedin, function(req,res){
	 var id = req.params.id.toString();
     deletemessage(id,function(err,data){
            
     });
     res.redirect('/mymessage');
});
app.get('/settings',adminloggedin ,function(req,res){
   res.render('settings');
});
app.get('/changepassword',adminloggedin,function(req,res){
  res.render('changepassword');
});
app.get('/changeusername',adminloggedin,function(req,res){
   res.render('changeusername');
});
app.get('/changeemail',adminloggedin,function(req,res){
   res.render('changeemail');
});
// changing password
app.post('/changepassword',adminloggedin,function(req,res){
    var oldpassword = req.body.oldpassword;
    compare(oldpassword,req.user.password,function(err,check){
         if(err)
         	throw err;
         if(check){
         	 console.log('passes this shit');

              hash(req.body.newpassword,function(err,hash){
                adminpassword(req.user.username,hash,function(err,data){
                  if(data)
                  {
                  	var head ='change of password';
                    var mssg = ' password has been changed';
                    var email = req.user.email;
                    sendmail(email,head,mssg,function(err,status){
                      console.log(status);
                     });
                  }
                  // redirecting 
              });
              });
         }
         else{
             // redirecting 
         }
         res.redirect('/settings');
    });
});
// changing username 
app.post('/changeusername', adminloggedin,function(req,res){
   var password = req.body.password;
   var username = req.body.username;
   compare(password, req.user.password,function(err,check){
      if(err)
      	throw err;
      if(check){
         adminusername(req.user.username,username,function(err,data){
             if(data){
                  var head ='change of username';
                  var mssg = ' username has been changed';
                  var email = req.user.email;
                  sendmail(email,head,mssg,function(err,status){
                     console.log(status);
                  });
             }
         });
      }
      else{
          
      }
   });
   res.redirect('/settings');
});
// changing email
app.post('/changeemail', adminloggedin,function(req,res){
   var password = req.body.password;
   var email = req.body.email;
   compare(password, req.user.password,function(err,check){
      if(err)
      	throw err;
      if(check){
      	 console.log(check);
      	 console.log(email);
         adminemail(req.user.username,email,function(err,data){
             console.log(err);
             if(data){
             	sendmail(email,'admin email changed for jogi nutritions','email change for admin',function(err,data){
                 console.log(data);
             });
             console.log(data);
             }
         });
      }
      else{
          
      }
   });
   res.redirect('/settings');
});
// forget password
app.get('/forgetpassword',function(req,res){
 res.render('forgetpassword');
});
// post forget password
app.post('/forgetpassword',function(req,res){
     var username = req.body.username;
     adminmake(username,function(err,data){
          if(data){
          	var code = Math.floor(100000 + Math.random() * 900000);
          	var message = 'your new password is '+ code;
          	hash(code.toString(), function(err,hash){
                 adminpassword(username,hash,function(err,data){
                    console.log(data);
                 });
          	});
            sendmail(data.email,'password change',message,function(err,data){
                console.log(data);
            });
          }
          else{
          
          }
          res.redirect('/forgetpassword');
     });
});
//admin search
app.post('/search', function(req,res){
   var search = req.body.search;
   allproduct(function(err,data){
   	if(err)
   		console.log(err);
   	if(!search)
   		res.render('myproduct',{data:data});
   	else
   	{    console.log('search');
   		processword(search,function(search1){
   			console.log(data);
          find(search1,data,function(data1){
          	   console.log(data1);
             res.render('myproduct',{data:data1});
          });
   		});
   	}
   });
});
// admin logout 
app.get('/logout',adminloggedin, function(req,res){
      req.logout();
      res.redirect('/adminlogin');
});
app.use(function(req,res,next){
  res.send('<h1>404  NO  PAGE  FOUND  </h1>');
});
// listeniing to the port 8080
app.listen(port,function(err){
if(err)
	console.log(err);
else
	console.log('connected to the port');
});