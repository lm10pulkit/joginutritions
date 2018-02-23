var mongoose = require('mongoose');
var schema = mongoose.Schema;
var requestschema =  new schema ({
userid:{
	type:String ,
	required:true
},
requestid:{
	type:String ,
	required:true,
	unique:true
},
productid:[String],
addressbar : {
  zip:Number,
  address : String ,
  city :String ,
  state: String 
}
});
var request= mongoose.model('request',requestschema);
var orderschema =  new schema ({
	userid:{
		type:String ,
		required:true
	},
	productid:[String]
  ,
  paymentid:{
    type:String 
  }
  ,
  requestid:{
     type:String 
  },
  addressbar:{
    zip:Number,
   address:String ,
   city: String ,
   state: String 
  }
});
var order = mongoose.model('order',orderschema);
var messageschema = new schema({
name :{
  type:String ,
  required:true
},
email:{
  type:String ,
  required:true
},
message:{
  type:String ,
  required:true
}
});
var message= mongoose.model('message',messageschema);
var userschema = new schema ({
   email:{
    type:String
   },
   no:{
    type:Number,
    required:true,
    unique:true
   },
   name :{
    type:String
   },
   password:{
    type:String ,
     required:true
   },
   verified:{
     type:Boolean ,
     default :false
   }
});
var user = mongoose.model('user',userschema);
var cartschema = new schema ({
userid:{
  type:String ,
  required:true
},
products :[String],
address:{
  type:String
},
zip:{
  type:String
},
city:{
  type:String
},
state:{
  type:String
}
});
var cart = mongoose.model('cart',cartschema);
var productschema = new schema ({
  name :{
    type:String ,
    required:true
  },
  description:{
    type:String 
  },
  price:{
    type:Number
  },
  imageurl:{
    type:String 
  },
  category:{
    type:String 
  },
  comments :[{
    userid:String ,
    comment:String 
  }]
});
var product = mongoose.model('product',productschema);
module.exports = {request,order,message,user,cart,product};
