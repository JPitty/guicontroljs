//Loading modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var b = require('bonescript');
var tempsensor = require('ds18x20');

// temp sensors
var T1 = '28-000006a35e72';
var temp1 = 0;

// Create pin variables (these work with 4D 7" ts)
var ssr = ["P8_11", "P8_12", "P8_14","P8_15", "P8_16", "P8_17","P9_25", "P9_27", "P8_23", "P8_24"];

// Initialize the pins as OUTPUT
/*var i, len;
for (len = ssr.length, i=0; i<len; ++i) {
  b.pinMode(ssr[i], b.OUTPUT);
}*/

// Initialize the server on port 8888
var server = http.createServer(function (req, res) {
    // requesting files
    // var file = '.'+((req.url=='/')?'/index.html':req.url);
    var file = './var/lib/cloud9/Projects/guicontroljs/index.html';
    //var file = './index.html';
    var fileExtension = path.extname(file);
    var contentType = 'text/html';

    // Uncoment if you want to add css to your web page    
    if(fileExtension == '.css'){
        contentType = 'text/css';
    }

    fs.exists(file, function(exists){
        if(exists) {
            fs.readFile(file, function(error, content){
                if(!error){
                    // Page found, write content
                    res.writeHead(200,{'content-type':contentType});
                    res.end(content);
                }
            })
        }
        else {
            // Page not found
            res.writeHead(404);
            res.end('Page not found');
        }
    })
}).listen(8888);

// Loading socket io module /usr/local/lib/node_modules/socket.io/node_modules/socket.io-client/
var io = require('socket.io').listen(server);

// When communication is established, call the fxn
io.on('connection', function (socket) {
    socket.on('changeState', handleChangeState);
    socket.on('sliderState', handleSliderState);
});

// Starting button states
var buts = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

// Change state when a button is pressed
function handleChangeState(data) {
    //var newData = JSON.parse(data);  //ALREADY in JSON format, so causes error!
    console.log("ssr = " + data.ssr);
    buts[data.ssr] = data.state;
    b.digitalWrite(ssr[data.ssr], data.state);
    io.sockets.emit('btnState', data);
}

// Initial slider states
var ontime1 = 0;
var ontime2 = 0;

// Gloabl timer for slider duty cycles, temp updates, ...
var dcTimer = setInterval( function myF(){ 
        cycleChangeState();
	getTemp();
      } , 5000);

//Change slider duty cycle on time
function handleSliderState(data) {
  console.log(data);
  if ( data.slider == 0 ) {
      // Change the global ontime1 var
      ontime1 = data.duty * 50;
  }
  else if ( data.slider == 1 ) {
      // Change the global ontime2 var
      ontime2 = data.duty * 50;
  }
}

// One cycle that gets called repeatedly
function cycleChangeState() {
    // Heater 1 duty cycle switching
    //FIX: add IF to check button state on both, and check if ontime is > 4
    if ( buts[0] > 0) {
      b.digitalWrite(ssr[0], 1 ); //fix: should be '0'
      io.sockets.emit('btnState', {ssr:0, state:1 });
      console.log("H1 turned ON");
      setTimeout( function myCycle () {
          b.digitalWrite(ssr[0], 0 );
          io.sockets.emit('btnState', {ssr:0, state:0 });
          console.log("H1 turned OFF");
      } , ontime1); //fix: specific to slider1
    }
    // Heater 2 duty cycle switching
    if ( buts[1] > 0) {
      b.digitalWrite(ssr[1], 1 ); //fix: should be '1'
      io.sockets.emit('btnState', {ssr:1, state:1 });
      console.log("H2 turned ON");
      setTimeout( function myCycle () {
          b.digitalWrite(ssr[1], 0 );
          io.sockets.emit('btnState', {ssr:1, state:0 });
          console.log("H2 turned OFF");
      } , ontime2);
    }
}

function getTemp() {
	//var tempfile='/sys/bus/w1/devices/28-000006a35e72/w1_slave'
	//tempsensor.getAll(function (err, tempObj) {
	//	    console.log(tempObj);
	//});
	//FIX: read multiple sensors
	tempsensor.get(T1, function (err, temp) {
		temp1 = temp;
	});
	io.sockets.emit('tempState', temp1);
}

// Displaying a console message for user feedback
server.listen(console.log("Server Running ..."));
