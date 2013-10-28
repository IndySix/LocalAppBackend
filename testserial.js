

// Setup serial port
var SerialPort = require("serialport").SerialPort
var arduino = new SerialPort("/dev/tty.usbmodem641", { baudrate: 9600 });

arduino.on("open", function () {
  	arduino.on('data', function(data) {

	  	// Print data
	    console.log(data);

  	});  
});

