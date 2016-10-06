var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reviewschema = new Schema({
    rating: {
        type: Number,
        "default": 0,
        min: 0,
        max: 5
	},
    description : String,
    time : { type : Date, default: Date.now },
    author : {
    	type: Schema.Types.ObjectId,
        ref: 'User'
    },
    parkingspot : {
    	type: Schema.Types.ObjectId
    }

});


mongoose.model('Review', reviewschema);