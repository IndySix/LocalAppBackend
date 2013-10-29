

// Setup serial port
var serialport = require("serialport");
var SerialPort = require("serialport").SerialPort
var arduino = new SerialPort("/dev/tty.usbmodem641", { baudrate: 9600 , 
  parser: serialport.parsers.readline("\r\n")});

arduino.on("open", function () {
  	arduino.on('data', function(data) {

	  	// Print data
	    console.log(data.toString().replace('\r\n', ''));

  	});  
});

