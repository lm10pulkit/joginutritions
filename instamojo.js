var express = require('express');
var app = express();
var request= require('request');
var bodyParser = require('body-parser');
var instamojonodejs = require('body-parser');
var instamojoWebhook = require("instamojo-webhook");
var localtunnel = require('localtunnel');
/*  var request= require('request');

var headers = { 'X-Api-Key': 'd140ab432032cf4e4473cee6d2dc2844', 'X-Auth-Token': '5889dcadfd3ea8a2a8e5bdab85778ca0'};
function requests(callback){
request.get('https://www.instamojo.com/api/1.1/payment-requests/', {headers: headers}, function(error, response, body){
  if(!error && response.statusCode == 200){
    callback(body);
  }
});
}
var removepaymentlink = function(id){
request.post('https://www.instamojo.com/api/1.1/payment-requests/'+id+'/disable/',{headers:headers},function(err, response,body){
console.log(body);
});
};  */
//removepaymentlink('f4da71e7cab74923ae6723b0029ab761');
app.set('view engine','ejs');
app.get('/',function(req,res){
   res.render('form');
});
var arr = function(callback){
 localtunnel(3000, callback);
};
app.get('/payment', function(req,res){
  var headers = { 'X-Api-Key': 'd140ab432032cf4e4473cee6d2dc2844', 'X-Auth-Token': '5889dcadfd3ea8a2a8e5bdab85778ca0'};
arr(function(err, tunnel){
var payload = {
  purpose: 'FIFA 16',
  amount: '9',
  phone: '9958005393',
  buyer_name: 'John Doe',
  redirect_url: tunnel.url+'/',
  send_email: false,
  webhook: tunnel.url+'/paymentdetails',
  send_sms: false,
  email: 'realmadrid10pulkit@gmail.com',
  allow_repeated_payments:false
};
request.post('https://www.instamojo.com/api/1.1/payment-requests/',{form:payload,headers:headers}, function(err,resp,body){
  var body =JSON.parse(body);
  console.log(body);
  res.redirect(body.payment_request.longurl);
}); 	
});
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var instamojoMiddleWare = instamojoWebhook({ secretKey: 'd140ab432032cf4e4473cee6d2dc2844'});
app.post("/paymentdetails",function(req,res){
   console.log('in the payment details');
  console.log(req.instamojo);
  console.log(req.body);
  res.send("hello");
});

//ab24cbcea65e407485b120c8750ac080
app.listen(3000,function(err){
	console.log('connected to the port');
});