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
	    	//var review;

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

	            description = "";
	            if(req.body.description){
	            	description = req.body.description;
	            }
	            var rating = parseInt(req.body.rating);
				if(rating < 0){
					rating = 0;
				}
				if(rating > 5){
					rating = 5;
				}

	            review = new Review();
	            review.rating = rating;
	            review.description = description;
	            review.author = user;
	            review.parkingspot = parkingspot;
	            /*
				console.log(parkingspot.reviews);
				console.log("------TEST------");
	            parkingspot.reviews.push(review);
	            console.log(parkingspot.reviews);
				*/
	            review.save(function(err){
			        if(err) {
			            sendJSONresponse(res, 404, err);
			        }else{

			        	Parkingspot.update({_id: req.params.id}, {$push: {"reviews": review }},{new: true, safe: true, upsert: true}, function (err, parking) {
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
						
			        }
			    });
            });
		});
	}else{
		console.log('No id');
        sendJSONresponse(res, 404, {
          "message": "Parkingspot ID not specified"
        });
	}

};

/*
Returns the user object from the authorization header
*/
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

/*
GET:id
returns a review specified by the id
*/
module.exports.getReviewById = function(req, res) {
	 if(req.params && req.params.reviewid){
        Review
            .findById(req.params.reviewid, function (err, review) {
                if (!review) {
                    sendJSONresponse(res, 404, {
                        "message": "review id not found"
                    });
                    return;
                } else if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                    return;
                }
                console.log(review);
                sendJSONresponse(res, 200, review);
            });
    } else {
        console.log('No id');
        sendJSONresponse(res, 404, {
          "message": "ID not specified"
        });
    }
};

/*
GET
returns all reviews for the parking spot
*/
module.exports.getReviews = function(req, res) {
	 if(req.params && req.params.id){
        Parkingspot
            .findById(req.params.id).populate('reviews').exec(function (err, parkingspot) {
                if (!parkingspot) {
                    sendJSONresponse(res, 404, {
                        "message": "review id not found"
                    });
                    return;
                } else if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                    return;
                }
                console.log(parkingspot);
                sendJSONresponse(res, 200, parkingspot.reviews);

            });
    } else {
        console.log('No id');
        sendJSONresponse(res, 404, {
          "message": "ID not specified"
        });
    }
};


module.exports.modifyReview = function(req, res) {
	 if(req.params && req.params.id && req.params.reviewid){
	 	if(req.body.rating && req.body.description){
	 		getUser(req, res, function(req, res, user){

	 			Review.findById(req.params.reviewid).exec(function (err, review) {
	                if (!review) {
	                    sendJSONresponse(res, 404, {
	                        "message": "review id not found"
	                    });
	                    return;
	                } else if (err) {
	                    console.log(err);
	                    sendJSONresponse(res, 404, err);
	                    return;
	                }

	                //Checking that the author is same
	                if(user._id.toString() !== review.author.toString()){
	                	console.log("invalid author "+user._id+" "+review.author);
	                    sendJSONresponse(res, 401, {
	                    	'message' : 'You are not the author of this review.'
	                    });
	                    return;
	                }

	                var rating = parseInt(req.body.rating);
					if(rating < 0){
						rating = 0;
					}
					if(rating > 5){
						rating = 5;
					}
					var description = req.body.description;

					Review.findByIdAndUpdate(req.params.reviewid, {$set: { rating: rating, description: description }},{new: true, safe: true, upsert: true}, function (err, review) {
						if(err) {
				            sendJSONresponse(res, 404, err);
				        }else{
				        	console.log("-----------");
				      		console.log(review);

						sendJSONresponse(res, 201, {
				            'review' : review
				        });
						}
					});

	            });

				
			});
		} else {
	        console.log('New values not defined');
	        sendJSONresponse(res, 400, {
	          "message": "New values not defined"
	        });
	    }
    } else {
        console.log('No id');
        sendJSONresponse(res, 404, {
          "message": "ID not specified"
        });
    }
};

module.exports.deleteReview = function(req, res) {
	 if(req.params && req.params.id && req.params.reviewid){
 		getUser(req, res, function(req, res, user){
 			Review.findById(req.params.reviewid, function (err, review) {
 				console.log("review "+review);
                if (!review) {
                    sendJSONresponse(res, 404, {
                        "message": "review id not found"
                    });
                    return;
                } else if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                    return;
                }

                //Checking that the author is same
                if(user._id.toString() !== review.author.toString()){
                	console.log("invalid author "+user._id+" "+review.author);
                    sendJSONresponse(res, 401, {
                    	'message' : 'You are not the author of this review.'
                    });
                    return;
                }

                Review.remove({ _id: req.params.reviewid }, function(err, removed) {
				    if (err) {
	                    console.log(err);
	                    sendJSONresponse(res, 404, err);
	                    return;
	                } 

					Parkingspot.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewid}}, function(err, data){
					  	console.log(err, data);
					  	if (err) {
		                    console.log(err);
		                    sendJSONresponse(res, 404, err);
		                    return;
		                }
		                sendJSONresponse(res, 200, {
		                    "deleted": data
		                });

					});
											    
				});

            });
 		});

	} else {
        console.log('No id');
        sendJSONresponse(res, 404, {
          "message": "ID not specified"
        });
    }
};