var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');
var userschema = require('./schema/userschema.js');
var user = mongoose.model('user',userschema);
var otpschema = require('./schema/otpschema.js');
var otp = mongoose.model('otp',otpschema);
var productschema = require('./schema/productschema.js');
var product = mongoose.model('product',productschema);
var findbyno = function(no,callback){
    user.findOne({no:no},callback);
};
var save= function(data, callback){
  var new_user = new user(data);
  new_user.save(callback);
};
var updateuser = function(userid,data,callback){
  user.findOne({_id:userid},data,callback);
};
var generateotp = function(no,code,callback){
     otp.findOne({no:no}).then(function(err,data){
     	if(err){
     		console.log(err);
     		return callback(err);
     	}
     	else{
     		     var time = new Date().getTime();
                 if(data){

                 	opt.update({no:no},{otp:code,time:time},callback);
                 }
                 else{
                 	 var data ={no:no,otp:code,time:time};
                 	 var new_otp = new otp(data);
                 	 new_otp.save(callback);
                 }
     	}
     });
};
var matchotp = function(no,code,callback){

otp.findOne({no:no}).then(function(data){
	if(!data){
		return callback('phoneno does not exsist',false);
	}
	else{
		if(data.otp!=code){
			return callback('otp did not match',false);
		}
		else
		{
			var time = new Date().getTime();
			if(time+300000<=data.time){
				return callback('time out',false);
			}
			else{
				return callback('successful',true);
				user.update({no:no},{verified:true}).then(function(data){
					console.log(data);
				},
				function(err){
					console.log(err);
				}
				);
			}
		}
	}
});
};
var addcomment = function(id,userid,comment,callback){
   product.update({_id:id},{$push :{comments :{userid:userid,comment:comment}}},callback);
};
var addproduct = function(data,callback){
       var new_product = new product(data);
       new_product.save(callback);      
};
var removeproduct = function(id,callback){
       product.remove({_id:id},callback);
};
var deletecomment = function(id,commentid,callback){
      product.update({_id:id},{$pull :{comments:{_id:commentid}}});
};
var findproduct = function(id,callback){
    product.findOne({_id:id},callback);
};

module.exports= {
findbyno,
updateuser,
save,
generateotp,
matchotp,
findproduct
};
