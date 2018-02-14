var nodemailer = require('nodemailer');
var sendmail= function(to,subject,text,callback){
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'webdevelopersservices@gmail.com',
    pass: 'webdeveloper'
  }
});

var mailOptions = {
  from: 'webdevelopersservices@gmail.com',
  to: to,
  subject:subject ,
  text: text
};

transporter.sendMail(mailOptions, callback);
};
module.exports =sendmail;