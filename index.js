
// Import modules
var request = require('request'); 
var crypto = require('crypto');

// Global variables 
var API_URL = 'http://145.89.128.41/projecten/website/api/';
var RFID_KEY = '';
var USER_DATA = ''

function createChellangeHash(){
	var hash = crypto.createHash('md5').update('randomchallangehash').digest("hex"); // Change what you hash into user and challange ID
	return hash
}


// 
function checkinUser(RFID_KEY){
	
}

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

// Setup serial port for RFID check.
var SerialPort = require("serialport").SerialPort
var arduino = new SerialPort("/dev/tty.usbmodem641", { baudrate: 9600 });
var receivedData = "";

arduino.on("open", function () {
  	arduino.on('data', function(data) {
 		
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


