var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dhujdb1zv', 
  api_key: '443542749568666', 
  api_secret: 'EkdDKqhZbal71U9z-BwaN97hAso' 
});
var uploadphoto = function(url,callback){
cloudinary.uploader.upload(url,callback,{
	width:400,
	height:400
});
};
module.exports= uploadphoto;

