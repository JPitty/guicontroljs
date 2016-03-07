//Loading modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var b = require('bonescript');
var tempsensor = require('ds18x20');

// Create pin variables (these work with 4D 7" ts)
var ssr = ["P8_11", "P8_12", "P8_14","P8_15", "P8_16", "P8_17","P9_25", "P9_27", "P8_23", "P8_24"];

// Initialize the server
var server = http.createServer(function (req, res) {
    // requesting files
    //var file = '.'+((req.url=='/')?'/index.html': req.url);
    var file = ((req.url=='/')?__dirname + '/index.html':__dirname + req.url);
    //var file = './var/lib/cloud9/Projects/guicontroljs/index.html';
    //var file = './index.html';
    var fileExtension = path.extname(file);
    var contentType = 'text/html';

    //if(fileExtension == '.css'){ *DOES NOT WORK
    if(req.url.indexOf('.css') != -1){
	file = req.url;
	contentType = 'text/css';
    }
    
    if(req.url.indexOf('.js') != -1){
	file = req.url;
	contentType = 'text/javascript';
    }
/*
    if(req.url.indexOf('.html') != -1){ //req.url has the pathname, check if it conatins '.html'
      fs.readFile(__dirname + '/index.html', function (err, data) {
         if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
      });
    }

    if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'
      fs.readFile(__dirname + '/js/script.js', function (err, data) {
         if (err) console.log(err);
           res.writeHead(200, {'Content-Type': 'text/javascript'});
           res.write(data);
           res.end();
      });
    }

    if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'
      fs.readFile(__dirname + '/public/css/bootstrapjp.css', function (err, data) {
         if (err) console.log(err);
           res.writeHead(200, {'Content-Type': 'text/css'});
           res.write(data);
           res.end();
      });
    }
*/    
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

// temp sensors
//var Tsensors = [ '28-000006a35e72', '28-000006902652', '28-0000068f1f49'];
//var temps = [ 0, 0, 0 ];

function getTemp() {
	// files in '/sys/bus/w1/devices/28-000006a35e72/w1_slave'
	//temps = tempsensor.get(Tsensors);
	var tempObj = tempsensor.getAll();
	io.sockets.emit('tempState', tempObj);
}

// Displaying a console message for user feedback
server.listen(console.log("Server Running ..."));
