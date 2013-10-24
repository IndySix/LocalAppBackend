
// Import modules
var request = require('request'); 
var crypto = require('crypto');

// Global variables 
var API_URL = 'http://145.89.128.41/projecten/website/api/';
var RFID_KEY = '1234567890';
var USER_DATA = ''

function createChallangeHash(){
	var hash = crypto.createHash('md5').update('randomchallangehash').digest("hex"); // Change what you hash into user and challange ID
	return hash
}

function checkinUser(RFID_KEY){
	r = API_URL + 'checkinUser/' + RFID_KEY
	
	request(r, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			USER_DATA = body;
		} 
	})
}


// Local API setup
var express = require('express'); // Framework 
var web = express(); // Setup app
web.use(express.bodyParser()); // Configure POST parser

// GET user
web.get('/user', function(req, res) {

	// If RFID is present, get the user based on the RFID KEY
	if (RFID_KEY){
		checkinUser(RFID_KEY);
	}

	console.log(USER_DATA);

	// Build JSON response
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	res.writeHead(200, { 'Content-Type': 'application/json' }); 
	res.write(USER_DATA);
	res.end()

});

web.listen(8000);


// Setup serial port
// var SerialPort = require("serialport").SerialPort
// var arduino = new SerialPort("/dev/tty-usbmodem641", { baudrate: 9600 });

// // User data for storage of a challenge
// var user_data
// var user_hash

// arduino.on("open", function () {
//   	arduino.on('data', function(data) {

// 	  	// Print data
// 	    console.log('data received: ' + data);

// 	    // If user checks in, check users data:
// 	    if(data != ''){
// 			request('localhost:9999/?user_id=' + data, function (error, response, body) {
// 				if (!error && response.statusCode == 200) {
// 					user_data = body;
// 				}
// 			})
// 	    }
//   	});  
// });

