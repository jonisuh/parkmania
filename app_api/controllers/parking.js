//MONGOOSE
var mongoose = require('mongoose');
var passport = require('passport');
var Parkingspot = mongoose.model('Parkingspot');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

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
