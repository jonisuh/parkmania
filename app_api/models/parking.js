var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var parkingschema = new Schema({
    address: String,
    coords: {
        type: [Number],
        index: '2dsphere'
	},
	reviews : [{
    	type: Schema.Types.ObjectId, 
    	ref: 'Review'}] 

});

mongoose.model('Parkingspot', parkingschema);