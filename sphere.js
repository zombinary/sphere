require('colors');
var util = require("util");
var express = require('express');
var app = express();

var fs    = require("fs");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engines = require('consolidate');

var menue = require('./routes/menue');
var settings = require('./routes/settings');

var config = require('./config.json');

/* tcp connection */
//var ipAddress = '10.11.0.100';
var tcp = require('./bin/tcp/pool');
var client = [];

var log = require('./lib/debug/logging');

app.set('views', path.join(__dirname, '/views'));
app.engine('html', engines.mustache);
app.set('view engine', 'html');

/* debugging */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* routes */
app.use('/', menue);
app.use('/', settings);

/* bootstrap, libs & stylesheets */
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/lib'));
app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/node_modules/bootstrap-slider/')); //slider
app.use(express.static(__dirname + '/node_modules/bootstrap-slider/dist')); //slider
app.use(express.static(__dirname + '/node_modules/bootstrap-slider/src')); //slider


//app.use(express.static(__dirname + '/public/images'));


for(var i=0; i<config.light.server.length;i++){
	for(var j=0; j<config.light.server[i].device.length;j++){
		log.debug(log.getLineNumber(), log.getFileName(), 'add: ' + config.light.server[i].device[j].ip+':'+ config.light.port);	
		client.push({ ipAddress: config.light.server[i].device[j].ip, client: tcp.get(config.light.server[i].device[j].ip, config.light.port)});
	}
}

/* connect to all clients */
for(var i=0; i<client.length;i++){
	log.debug(log.getLineNumber(), log.getFileName(), 'connect: ' + client[i].ipAddress+':'+ config.light.port);	
	client[i].client.connect();
}



/* create http server */
app.listen(config.general.port,function(){
  log.debug(log.getLineNumber(), log.getFileName(), 'runs on: localhost: ' + config.general.port);	
});

/* tcp send */
app.post('/tcpSend/', function(req,res) {
	var msg = {};
		msg.ip = req.body.ip;
	var buf = new Buffer ([null,null,null]);	
	
	if(!msg.ip){
	 log.error(log.getLineNumber(), log.getFileName(), 'no device selected');	
	}else{

		for(var i=0;i<client.length;i++){
			for(var j=0;j<msg.ip.length;j++){
				if(client[i].ipAddress === msg.ip[j]){
				    log.debug(log.getLineNumber(), log.getFileName(), 'send: ' + client[i].color + '[' +client[i].ipAddress + ']');	
					console.log('client.color: '.red.bold, client[i].color);

				    if(client[i].brightness){

				    	buf[0] = Math.round(((client[i].color >> 16) & 0xff) *3 / client[i].brightness) || 0;
				    	buf[1] = Math.round(((client[i].color >> 8) & 0xff) *3 / client[i].brightness) || 0;
				    	buf[2] = Math.round((client[i].color & 0xff) *3 / client[i].brightness) || 0;
							
				    }else{
						//self.client.write(data);
					  	
					  	buf[0] = (client[i].color & 0xff0000) >> 16;
					  	buf[1] = (client[i].color & 0x00ff00) >> 8;
					  	buf[2] = client[i].color & 0x0000ff;
					    
					  	console.log(typeof client[i].color);
					  	console.log((client[i].color >> 16) & 0xff);
					  	console.log((client[i].color >> 8) & 0xff);
					  	console.log(client[i].color & 0xff);
					  	//console.log(buf[2]);
				    	
				    }
				    
				    client[i].client.send(buf);
					break;
				}
			}
		}
		
//		/* convert int2hex string with fix length of 6chars */
//		var hexstr = '000000';
//		//util.log('[sphere] tcp send: '.cyan.bold + msg.ip.toString().grey);
//		for(var i=0;i<client.length;i++){
//			for(var j=0;j<msg.ip.length;j++){
//				if(client[i].ipAddress === msg.ip[j]){
//				    log.debug(log.getLineNumber(), log.getFileName(), 'send: ' + hexstr + '[' +client[i].ipAddress + ']');	
//				    hexstr = hexstr.slice(client[i].colour.length);
//				    hexstr = hexstr + client[i].colour;
//				    if(client[i].brightness){
//				    	var r = (Math.round(((parseInt(client[i].colour,16) >> 16) & 255) / client[i].brightness)) || 0;
//						var g = (Math.round(((parseInt(client[i].colour,16) >> 8) & 255) / client[i].brightness)) || 0;
//						var b = (Math.round((parseInt(client[i].colour,16) & 255) / client[i].brightness)) || 0;
//				
//						var hex_rgb = r;
//							hex_rgb = (hex_rgb << 8) + g;
//							hex_rgb = (hex_rgb << 8) + b; 
//
//						hexstr = '000000';
//					    hexstr = hexstr.slice(hex_rgb.toString(16).length);
//					    hexstr = hexstr + hex_rgb.toString(16);
//				    }
//				    
//				    client[i].client.send(hexstr);
//					break;
//				}
//			}
//		}
	}		
	res.send(200);
	return;
});
/* set color */
app.post('/setcolor/', function(req,res) {
	var setcolor = null;
	var msg = {};
		//msg.color = parseInt(req.body.colour).toString(16); // string value
		msg.color = req.body.color; // string value
		msg.ip = req.body.ip;
		
	if(!msg.ip){
	    log.debug(log.getLineNumber(), log.getFileName(), 'no device selected');	
	}else{
		for(var i=0;i<client.length;i++){
			for(var j=0;j<msg.ip.length;j++){
				if(client[i].ipAddress === msg.ip[j]){
					log.debug(log.getLineNumber(), log.getFileName(), 'set color: '.cyan.bold + msg.color + ' - ip: ' + msg.ip);	
					client[i].color = msg.color;
					setcolor = true;
					break;
				}
			}
		}
	}
	if(!setcolor){
	    log.error(log.getLineNumber(), log.getFileName(), 'could not set color ip: ' + ip);	
	}
	
	res.send(200);
	return;
});

/* set brightness */
app.post('/setbrightness/', function(req,res) {
	var setbrightness = null;
	var msg = {};
		msg.brightness = req.body.brightness; // string value
		msg.ip = req.body.ip;
		
	if(!msg.ip){
		log.error(log.getLineNumber(), log.getFileName(), 'no device selected');	
	}else{
		for(var i=0;i<client.length;i++){
			for(var j=0;j<msg.ip.length;j++){
				if(client[i].ipAddress === msg.ip[j]){
					log.debug(log.getLineNumber(), log.getFileName(), 'set brightness: ' + msg.brightness + ' - ip: '.grey + msg.ip);	

					client[i].brightness = msg.brightness;
					setbrightness = true;
					break;
				}
			}
		}
	}
	if(!setbrightness){
		log.error(log.getLineNumber(), log.getFileName(), 'could not set brightness ip: '.grey + ip);
	}
	
	res.send(200);
	return;
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	// production error handler
	// no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {	
      message: err.message,
      error: err
    });
  });
}
//debug log
//log.msg('info', log.getFileName(), log.getLineNumber(), 'package [iolink] - state [ready]'.cyan.bold);


