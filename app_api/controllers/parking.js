//MONGOOSE
var mongoose = require('mongoose');
var passport = require('passport');
var Parkingspot = mongoose.model('Parkingspot');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/*
GET
Returns all parking spots in the database
*/
module.exports.getAllParkingSpots = function(req, res) {
    Parkingspot.find(function (err, parkingspots) {
        if(err) {
            sendJSONresponse(res, 404, err);
        }else{
            console.log(parkingspots);
            sendJSONresponse(res, 200, parkingspots);
        }
    });
};

/*
GET:id
Finds a parking spot specified by the id
*/
module.exports.getParkingSpot = function(req, res) {
    if(req.params && req.params.id){
        Parkingspot
            .findById(req.params.id, function (err, parkingspot) {
                if (!parkingspot) {
                    sendJSONresponse(res, 404, {
                        "message": "parking id not found"
                    });
                    return;
                } else if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                    return;
                }
                console.log(parkingspot);
                sendJSONresponse(res, 200, parkingspot);
            });
    } else {
        console.log('No id');
        sendJSONresponse(res, 404, {
          "message": "ID not specified"
        });
    }
};

/*
GET near
Finds parking spots near the specified coordinates
*/
module.exports.getParkingSpotsNear = function(req, res) {
    console.log(req.query.lng+" "+req.query.lat+" "+req.query.maxdist+" "+req.query.results);
    if(!req.query.lng || !req.query.lat || !req.query.maxdist || !req.query.results){
        sendJSONresponse(res, 400, {
            'message' : 'All fields required'
        });
        return;
    }
    var point = {
        type: "Point", 
        coordinates:[parseFloat(req.query.lng), parseFloat(req.query.lat)]
    };
    var options = {
        spherical: true,
        maxDistance: parseFloat(req.query.maxdist) * 1000,
        num: parseInt(req.query.results)
    };

    Parkingspot.geoNear(point, options, function(err, results, stats){
        if(err){
            sendJSONresponse(res, 404, err);
        }else{
            console.log(results);
            var parkingspots = parkingSpotsAsList(req, res, results, stats);
            sendJSONresponse(res, 200, parkingspots);
        }
    });
};

//Get parking spots list from the geoNear results
var parkingSpotsAsList = function(req, res, results, stats) {
  var parkingspots = [];
  results.forEach(function(doc) {
    parkingspots.push({
      distance: doc.dis,
      address: doc.obj.address,
      coords: doc.obj.coords,
      reviews: doc.obj.reviews,
      _id: doc.obj._id
    });
  });
  return parkingspots;
};

/*
POST
Create new parking spot
*/
module.exports.addParkingSpot = function(req, res) {
    console.log(req.body.address+" "+req.body.lng+" "+req.body.lat);
    if(!req.body.address || !req.body.lng || !req.body.lat ){
        sendJSONresponse(res, 400, {
            'message' : 'All fields required'
        });
        return;
    }

    var parkingspot = new Parkingspot();
    parkingspot.address = req.body.address;
    parkingspot.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)],

    parkingspot.save(function(err){
        if(err) {
            sendJSONresponse(res, 404, err);
        }else{
            console.log(parkingspot);
            sendJSONresponse(res, 201, {
                'parkingspot' : parkingspot.address +" "+parkingspot.coords
            });
        }
    });

};

/*
PUT:id
Modify parking spot
*/
module.exports.modifyParkingSpot = function(req, res) {
    

};

/*
DELETE parking spot
*/
module.exports.deleteParkingSpot = function(req, res) {
    

};