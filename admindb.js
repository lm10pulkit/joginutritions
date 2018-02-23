var mongoose = require('mongoose');
var {hash,compare} = require('./hashing.js');
var schema = require('mongoose').Schema;
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost/jogibro');

var {request,order,message,user,cart,product} = require('./schema.js');
var adminschema =  new schema ({
   username :{
   	type:String ,
   	required:true
   },
   password:{
   	type:String ,
   	required:true
   },
   email:{
      type:String,
      required:true
   },
   admin :{
    type:Boolean,
    default:true
   }
});
var admincheck = function(callback){
   admin.findOne({},function(err,data){
    if(data)
      return callback(false);
    else
      return callback(true);
   });
  };
 var adminemail = function(username,email ,callback){
     admin.update({username:username},{email:email},callback);
 };
var admin = mongoose.model('admin',adminschema);
   var saveadmin = function(body,callback){
         var new_admin = new admin(body);
         new_admin.save(callback);
   };
  var adminid = function(id,callback){
      admin.findOne({_id:id},callback);
  };
 var adminusername = function(username1,username2,callback){
       admin.update({username:username1},{username:username2},callback);
 };
 var adminpassword = function(username,password,callback){
    admin.update({username:username},{password:password},callback);
 };
 var adminmake = function(username,callback){
    admin.findOne({username:username},callback);
 };
var addproduct=function(body,callback){
    var new_product = new product(body);
    new_product.save(callback);
};
var allproduct = function(callback){
   product.find({},callback);
};
var updateimage = function(id,imageurl,callback){
    product.update({_id:id},body,callback);
};
var editproduct = function(id,body,callback){
    product.update({_id:id},body,callback);
};
var findproduct = function(id,callback){
     product.findOne({_id:id},callback);
};
var deleteproduct = function(id,callback){
    product.remove({_id:id},callback);
};
var allproduct = function(callback){
  product.find({},callback);
};
var findbycategory= function(category,callback){
  product.find({category:category},callback);
};
var findallproduct = function(productids,callback){
   product.find({_id:{$in : productids}},callback)
};
// messages
var allmessages = function(callback){
   message.find({},callback);
};
var createmessage = function(data,callback ){
   var new_message = new message(data);
   new_message.save(callback);
};
var deletemessage= function(id,callback){
  message.remove({_id:id},callback);
};
//cart
var createcart = function(id,callback){
  var userid= id.toString();
  var  new_cart = new cart({userid:userid});
  new_cart.save(callback);
};
var addtocart = function(userid,productid,callback){
   cart.update({userid:userid},{$push :{products:productid}},callback);
};
var findcart = function(userid,productid,callback){
    cart.findOne({userid:userid,products:productid},callback);
};
var removefromcart = function(userid,productid,callback){
    cart.update({userid:userid},{$pull :{products:productid}},callback);
};
var findacart = function(userid,callback){
   cart.findOne({userid:userid},callback);
};
var addaddresstocart= function(userid,data,callback){
   cart.update({userid:userid},data,callback);
};
//user
var finduser = function(no,callback){
     user.findOne({no:no},callback);
};
var adduser = function(no,password,callback){
       var body={
          no,
          password
       };
     var new_user = new user(body);
     new_user.save(callback);
};
var userbyid = function(id,callback){
    user.findOne({_id:id},callback);
};
var updateuser = function(id,data,callback){
    user.update({_id:id},data,callback);
};
//  orders
 module.exports = {
adminmake,adminusername,adminpassword,addproduct,allproduct,
editproduct,updateimage,deleteproduct,findproduct,allmessages,
deletemessage,adminid,saveadmin,adminemail,admincheck,allproduct,
finduser,adduser,userbyid,updateuser,createcart,findcart,addtocart,
removefromcart,findacart,findallproduct,addaddresstocart
 };
var clear= function(){
  admin.remove({},function(err,data){
      console.log(data);
      console.log(err);
  });
  product.remove().then(function(data){
    console.log(data);
  });
};
cart.find().then(function(data){
  console.log(data);
});