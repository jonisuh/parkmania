var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrlAuth = require('../controllers/authentication');
var ctrlPark = require('../controllers/parking');
var ctrlReview = require('../controllers/reviews');

//Parking spot api
router.get('/api/parkingspot/all', ctrlPark.getAllParkingSpots);
router.get('/api/parkingspot', ctrlPark.getParkingSpotsNear);
router.get('/api/parkingspot/:id',  ctrlPark.getParkingSpot);
router.get('/api/parkingspot/',  ctrlPark.getParkingSpot);
router.post('/api/parkingspot', auth,  ctrlPark.addParkingSpot);
/*
router.put('/api/parkingspot/:id',  ctrlPark.);
router.delete('/api/parkingspot/:id',  ctrlPark.);
*/

//Review api
router.get('/api/parkingspot/:id/review',  ctrlReview.getReviews);
router.get('/api/parkingspot/:id/review/:reviewid',  ctrlReview.getReviewById);
router.post('/api/parkingspot/:id/review', auth,  ctrlReview.createReview);
router.put('/api/parkingspot/:id/review/:reviewid', auth,   ctrlReview.modifyReview);
router.delete('/api/parkingspot/:id/review/:reviewid', auth,  ctrlReview.deleteReview);

//authentication
router.post('/api/register', ctrlAuth.register);
router.post('/api/login', ctrlAuth.login); 

module.exports = router;
