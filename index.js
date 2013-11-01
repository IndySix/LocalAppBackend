// Config USB Serial ports
var rfidReaderPath = "/dev/tty.usbmodem641"
var sensorReaderPath = "/dev/tty.usbmodem441"

// Globals
RFID_KEY = '';
RESPONSE_DATA_checkinUser = '{ "status" : "fail", "data" : {} }'
RESPONSE_DATA_latestResultParts = '{ "status" : "fail", "data" : {} }'
RESPONSE_DATA_getKingPart = '{ "status" : "fail", "data" : {} }'
RESPONSE_DATA_getChallengeStatus = '{ "status" : "fail", "data" : {} }'
CHALLENGE = false;
// Website API location
var API_URL = 'http://145.89.128.74/projecten/website/api/';

// Import modules
var request = require('request'); // Requests for API.
var crypto = require('crypto'); // For hashing
var serialport = require("serialport")
var SerialPort = serialport.SerialPort // Serial Arduino ports
var spawn = require('child_process').spawn // Child process for python video 

// Local server setup for API
var express = require('express'); // Framework 
var web = express(); // Setup app and configure:
web.use(express.json());
web.use(express.urlencoded());

// GET user data and return it for the bigger view
web.get('/checkinUser', function(req, res) {
	console.log('\033[33mREQ:\033[0m /checkinUser')
	// If RFID is present, get the user based on the RFID KEY
	if (RFID_KEY && CHALLENGE == false){
		CHALLENGE = true;
		r = API_URL + 'checkinUser/' + RFID_KEY
		console.log('\033[31mGET: \033[0m' + r);
		request(r, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				RESPONSE_DATA_checkinUser = body; // Set user data for returning 
				console.log("\033[32mRES: \033[0m" + body);

				if (body.status != 'fail'){
					var challengeTimeout = JSON.parse(RESPONSE_DATA_checkinUser).data.level.playTime * 1000
					console.log("\033[34mStarting challenge for: \033" + RFID_KEY + ", timeout: " + challengeTimeout);
					setTimeout(function() { finishChallenge(RFID_KEY) }, challengeTimeout)
					setTimeout(testChallenge, 5000);
					
				}
			} 
		})
		
	}

	// Build JSON response
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
	res.write(RESPONSE_DATA_checkinUser);
	res.end()
});



function finishChallenge(key){
	console.log('\033[34mFinished challenge for: \033' + key)
	RFID_KEY = ''
	RESPONSE_DATA_checkinUser = '{ "status" : "fail", "data" : {} }'
	CHALLENGE = false;
}

function testChallenge(){
	console.log('\033[34mTesting challenge for: \033' + RFID_KEY)
	RESPONSE_DATA_getChallengeStatus = '{ "status" : "success", "data" : "' + Math.floor((Math.random()*1000)+1) + '"}'
	finishChallenge(RFID_KEY)
}


web.get('/latestResultsParts/grind', function(req, res) {
	r = API_URL + 'latestResultsParts/grind'
	console.log('\033[33mREQ:\033[0m /latestResultsParts/grind');

	request(r, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			RESPONSE_DATA_latestResultParts = body; // Set user data for returning 
			console.log('\033[31mRES:\033' + body);
		} 
	})

	// Build JSON response
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
	res.write(RESPONSE_DATA_latestResultParts);
	res.end()
});

web.get('/getKingPart/grind', function(req, res) {	
	r = API_URL + 'getKingPart/grind'
	console.log('\033[33mREQ:\033[0m /getKingPart/grind');
	
	request(r, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			RESPONSE_DATA_getKingPart = body; // Set user data for returning 
			console.log('\033[31mRES:\033' + body);
		} 
	})

	// Build JSON response
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
	res.write(RESPONSE_DATA_getKingPart);
	res.end()
});

web.get('/getChallengeStatus', function(req, res) {	
	console.log('\033[33mREQ:\033[0m /getChallengeStatus');

	// Build JSON response
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
	res.write(RESPONSE_DATA_getChallengeStatus);
	res.end()
	RESPONSE_DATA_getChallengeStatus = '{ "status" : "fail", "data" : {} }'
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
	  		console.log("\033[31mRFID: \033[0m" + data);
 			RFID_KEY = data;	
	  	});  
	});
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


