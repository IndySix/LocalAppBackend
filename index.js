
// Import modules
var request = require('request'); // Requests for API.
var crypto = require('crypto'); // For hashing
var SerialPort = require("serialport").SerialPort // Serial Arduino ports
var spawn = require('child_process').spawn // Child process for python video 

// Global variables 
var API_URL = 'http://145.89.128.41/projecten/website/api/';
var RFID_KEY = '';
var USER_DATA = ''

// Local API setup
var express = require('express'); // Framework 
var web = express(); // Setup app
web.use(express.bodyParser()); // Configure POST parser

// GET user data and return it for the bigger view
web.get('/user', function(req, res) {

	// If RFID is present, get the user based on the RFID KEY
	if (RFID_KEY){
		r = API_URL + 'checkinUser/' + RFID_KEY
		console.log(r)
		request(r, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				USER_DATA = body; // Set user data for returning 
			} 
		})
	}

	console.log(USER_DATA); // Contains everything we know about the current checked in User

	// Build JSON response
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
	res.write(USER_DATA);
	res.end()

});

// TODO: Serve other pages here too... 
// Local port for listing to requests
web.listen(8000);
console.log('Serving pages on: http://localhost:8000')




// Setup serial port for RFID check.
var rfidreader = new SerialPort("/dev/tty.usbmodem641", { baudrate: 9600 });
if (rfidreader){
	var receivedData = "";

	rfidreader.on("open", function () {
	  	rfidreader.on('data', function(data) {
	 		
	 		receivedData += data.toString().replace('\r', '').replace('\n', '');

	 		if (receivedData.length == 10){
	 			var key = receivedData.slice(-10)
	 			RFID_KEY = key; // Set RFID key globally 
				console.log(key)
	 			receivedData = "";
	 		} else if (receivedData.length >= 10) {
	 			receivedData = "";
	 		}
	  	});  
	});
}

// Setup serial port for sensors.
var direction = 'R'
var oldvalues = new Array(2);
var start_record_time;
var start_detect_time;
var receivedSensorData;
var receivedSensorDataSeperator = '\r\n'

var sensorreader = new SerialPort("/dev/tty.usbmodem641", { baudrate: 9600 });
if (sensorreader){

	sensorreader.on("open", function () {
	  	sensorreader.on('data', function(d) {
	 		
	  		receivedSensorData += d.toString()

	  		if (receivedSensorData.indexOf(receivedSensorDataSeperator) != -1){
	  			// console.log(d);
		 		var newvalues = receivedSensorData.split(':'); // Parse this until a line ending character is found

		 		var left_old_dist = parseInt(oldvalues[1]);
		 		var left_new_dist = parseInt(newvalues[1]);
				var right_old_dist = parseInt(oldvalues[2]);
		 		var right_new_dist = parseInt(newvalues[2]);

		 		var time_dif = newvalues[0] - start_record_time;
		 		var detect_time_dif = newvalues[0] - start_detect_time;

		 		oldvalues = newvalues; // Cast new values to the old ones for the next loop

		 		if (time_dif > start_record_time){
			 		if (direction = 'R'){
			 			if(right_new_dist < right_old_dist && right_old_dist - right_new_dist > 40 && detect_time_dif > 250) {
							detect_time_dif = int(new_value[0]);
						}

			 			if(right_new_dist < right_old_dist && right_old_dist - right_new_dist > 40 and detectTime_dif < 250) {
							console.log("Skater passed right");
							start_record_time = parseInt(newvalues[1]);
						}
						// Start movie here
						// Spawn python script for recording video.
				 		//spawn('python', ['/pathtoscript', '-c', 'camerapath', '-n', 'filename', '-d', 'duration']);
			 		} 

					if (direction = 'L'){
						if(left_new_dist < left_old_dist && left_old_dist - left_new_dist > 40 && detect_time_dif > 250) {
							detect_time_dif = int(new_value[0]);
						}

			 			if(right_new_dist < right_old_dist && right_old_dist-right_new_dist > 40 and detectTime_dif < 250) {
							console.log("Skater passed left");
							start_record_time = parseInt(newvalues[1]);
						}
						// Start movie here
						// Spawn python script for recording video.
				 		//spawn('python', ['/pathtoscript', '-c', 'camerapath', '-n', 'filename', '-d', 'duration']);
			 		} 
				}
				receivedSensorData = '' // Empty received data buffer
	  		}
	  	});  
	});
}



