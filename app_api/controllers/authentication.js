//MONGOOSE
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

//post login
module.exports.login = function(req, res) {
    if(!req.body.email || !req.body.password){
    	sendJSONresponse(res, 400, {
    		'message' : 'All fields required'
    	});
		return;
	}

	passport.authenticate('local', function(err, user, infi){
		var token;

		if(err){
			sendJSONresponse(res, 404, err);
			return;
		}

		if(user){
			token = user.generateJwt();
			sendJSONresponse(res, 200, {
				'token' : token
			});
		}else{
			sendJSONresponse(res, 401, "Wrong user credentials!");
		}
	})(req, res);
};

//post register
module.exports.register = function(req, res) {
    if(!req.body.name || !req.body.email || !req.body.password){
    	sendJSONresponse(res, 400, {
    		'message' : 'All fields required'
    	});
    	return;
    }
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    user.save(function(err){
    	var token;
    	if(err) {
    		sendJSONresponse(res, 404, err);
    	}else{
    		token = user.generateJwt();
    		sendJSONresponse(res, 200, {
    			'token' : token
    		});
    	}
    });
};