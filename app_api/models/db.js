// config/database.js
var mongoose = require('mongoose');
var dbURI = 'mongodb://dbuser:dbpassword@ds021036.mlab.com:21036/jonidb';
var gracefulShutdown;
mongoose.connect(dbURI);

var readLine = require ("readline");
if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    });
    rl.on ("SIGINT", function (){
        process.emit ("SIGINT");
    });
}

mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to '+ dbURI);
});

mongoose.connection.on('error', function(err){
	console.log('Mongoose connection error '+ err);
});

mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected ');
});

gracefulShutdown = function (msg, callback) {
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through '+ msg);
		callback();
	});
}

require('./users');