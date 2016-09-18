
//MONGOOSE
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
	//Schema
var userschema = new mongoose.Schema({
    email:{
    	type: String,
    	unique: true,
    	required: true
    },
    name:{
    	type: String,
    	required: true
    },
    hash: String,
    salt: String

});

userschema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userschema.methods.validPassword = function(password){
	var validhash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	if(this.hash === validhash){
		return true;
	}
	else{
		return false;
	}
};

userschema.methods.generateJwt = function(){
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);	

	return jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		exp: parseInt(expiry.getTime() / 1000),
	}, process.env.JWT_SECRET);
};

mongoose.model('User', userschema);
