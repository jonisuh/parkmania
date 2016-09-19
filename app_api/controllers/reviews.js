//MONGOOSE
var mongoose = require('mongoose');
var passport = require('passport');
var Parkingspot = mongoose.model('Parkingspot');
var Review = mongoose.model('Review');
var User = mongoose.model('User');

var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/*
POST
Create new parking spot
*/

module.exports.createReview = function(req, res) {

    if(req.params && req.params.id && req.body.rating){
    	getUser(req, res, function(req, res, user){
	    	var review;

			Parkingspot
	        .findById(req.params.id, function (err, parkingspot) {
	            if (!parkingspot) {
	                sendJSONresponse(res, 404, {
	                    "message": "parkingspot id not found"
	                });
	                return;
	            } else if (err) {
	                console.log(err);
	                sendJSONresponse(res, 404, err);
	                return;
	            }

	            review = new Review();
	            review.rating = parseInt(req.body.rating);
	            review.author = user;
	            review.parkingspot = parkingspot;

	            review.save(function(err){
			        if(err) {
			            sendJSONresponse(res, 404, err);
			        }else{
			        	Parkingspot.findByIdAndUpdate(req.params.id, {$push: {"reviews": review }},{safe: true, upsert: true, new: true}, function (err, parking) {
							if(err) {
					            sendJSONresponse(res, 404, err);
					        }else{
					        	console.log("-----------");
					      	console.log(parking);

							sendJSONresponse(res, 201, {
				                'parkingspot' : parking
				            });
							}
						});
						/*
						Parkingspot
	        			.findById(req.params.id, function (err, parkingspot) {
	        				console.log("-----------");
					      	console.log(parkingspot);

							sendJSONresponse(res, 201, {
				                'parkingspot' : parkingspot
				            });
	        			});
						*/
			        	/*
			            console.log(review);
			            sendJSONresponse(res, 201, {
			                'review' : review
			            });
			            */
			        }
			    });
            });

	        


		    


			/*
		    review.save(function(err){
		        if(err) {
		            sendJSONresponse(res, 404, err);
		        }else{
		            console.log(review+" created");
		        }
		    });
		    
		    Parkingspot.findByIdAndUpdate(req.params.id, {$push: {"reviews": review }},{safe: true, upsert: true}, function (err, video) {
				if(err) throw err;
				res.json(video);
			});*/

		});
	}else{
		console.log('No id');
        sendJSONresponse(res, 404, {
          "message": "Parkingspot ID not specified"
        });
	}

};


var getUser = function(req, res, callback){
	if (req.payload && req.payload.email){
		User
		.findOne({email: req.payload.email })
		.exec(function(err, user){
			if(!user){
				sendJSONresponse(res, 404, {
					'message' : 'User not found'
				});
				return;
			}else if (err){
				console.log(err);
				sendJSONresponse(res, 404, err);
				return;
			}
			callback(req, res, user);
		});
	}else{
		sendJSONresponse(res, 404, {
			'message' : 'User not found'
		});
		return;
	}
};