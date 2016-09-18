var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrlAuth = require('../controllers/authentication');
var ctrlPark = require('../controllers/parking');

/*
//videos api
router.get('/api/videos', ctrlVideos.getAllVideos);
router.post('/api/videos', auth,  ctrlVideos.postNewVideo);
router.get('/api/videos/:id', ctrlVideos.getVideoByID);
router.put('/api/videos/:id', auth, ctrlVideos.updateVideoByID);
router.delete('/api/videos/:id', auth, ctrlVideos.deleteVideo);
*/

//Parking spot api
//router.get('/api/parkingspot', ctrlVideos.getAllVideos);
router.post('/api/parkingspot',  ctrlPark.addParkingSpot);

//authentication
router.post('/api/register', ctrlAuth.register);
router.post('/api/login', ctrlAuth.login); 

module.exports = router;
