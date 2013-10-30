
// Import modules
var request = require('request'); // Requests for API.
var crypto = require('crypto'); // For hashing
var serialport = require("serialport")
var SerialPort = serialport.SerialPort // Serial Arduino ports
var spawn = require('child_process').spawn // Child process for python video 

// Config USB Serial ports
var rfidReaderPath = "/dev/tty.usbmodem641"
var sensorReaderPath = "/dev/tty.usbmodem441"

// Global variables 
var API_URL = 'http://145.89.128.48/projecten/website/api/';
RFID_KEY = '';
var USER_DATA = '{ "status" : "fail", "data" : {} }'



// Local server setup for API
var express = require('express'); // Framework 
var web = express(); // Setup app and configure:
web.use(express.json());
web.use(express.urlencoded());

// GET user data and return it for the bigger view
web.get('/checkinUser', function(req, res) {

	// console.log(RFID_KEY)

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

	// console.log(USER_DATA); // Contains everything we know about the current checked in User

	// Build JSON response
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
	res.write(USER_DATA);
	res.end()
});


web.get('/latestResultsParts/grind', function(req, res) {	
	r = API_URL + '/latestResultsParts/grind'
	
	var d = '{ "status" : "fail", "data" : {} }'
	request(r, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			d = body; // Set user data for returning 
		} 
	})

	// Build JSON response
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
	res.write(d);
	res.end()
});

web.get('/getKingPart/grind', function(req, res) {	
	r = API_URL + '/getKingPart/grind'
	
	var d = '{ "status" : "fail", "data" : {} }'
	request(r, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			d = body; // Set user data for returning 
		} 
	})

	// Build JSON response
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
	res.write(d);
	res.end()
});






// TODO: Serve other pages here too... 
// Local port for listing to requests
web.listen(8000);
console.log('Serving pages on: http://localhost:8000')

// Setup serial port for RFID check.
var rfidreader = new SerialPort(rfidReaderPath, { baudrate: 9600 , parser: serialport.parsers.readline("\r\n")});
if (rfidreader){
	rfidreader.on("open", function () {
	  	rfidreader.on('data', function(data) {	
 			var key = data;
 			RFID_KEY = key;	
 			console.log("Starting challenge for: " + RFID_KEY);
 			setTimeout(function() { finishChallenge(RFID_KEY) }, 20000)
	  	});  
	});
}

function finishChallenge(key){
	console.log('Finished challenge for: ' + key)
	RFID_KEY = ''
	USER_DATA = '{ "status" : "failure", "data" : {} }'
}

// Setup serial port for sensors.
var sensorreader = new SerialPort(sensorReaderPath, { baudrate: 9600 , parser: serialport.parsers.readline("\r\n") });
if (sensorreader){
	sensorreader.on("open", function () {
	  	sensorreader.on('data', function(data) {
  		
  			if (data != "N"){
  				console.log(data)
	 			// Start movie here
	            // Spawn python script for recording video.
	            //spawn('python', ['/pathtoscript', '-c', 'camerapath', '-n', 'filename', '-d', 'duration']);
  			}
	  	});  
	});
} 


