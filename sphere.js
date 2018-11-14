require('colors');
var util = require("util");
var express = require('express');
var app = express();
var assert = require('assert');

var fs    = require("fs");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engines = require('consolidate');

var menue = require('./routes/menue');
var settings = require('./routes/settings');

var aurora_server = require('gravity-aurora');
//var config = require('./config.json');
var CONFIG = require('./lib/configManager');
var config = new CONFIG(__dirname + '/config.json');
var presets = require('./lib/presets');
var effects = require('./lib/effects');
var clients = [];

/* tcp connection */
//var ipAddress = '10.11.0.100';

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
app.use('/settings', settings);

/* bootstrap, libs & stylesheets */
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/lib'));
app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/node_modules/bootstrap-slider/')); //slider
app.use(express.static(__dirname + '/node_modules/bootstrap-slider/dist')); //slider
app.use(express.static(__dirname + '/node_modules/bootstrap-slider/src')); //slider

if(Array.isArray(config.light.devices)){
for(var i=0; i<config.light.devices.length;i++){
	var dev = config.light.devices[i];
	if(!dev.ip){console.log('ERROR: '.red.bold, 'could not add device with no ip'); continue;}
	if(!dev.port){console.log('ERROR: '.red.bold, 'could not add device with no port'); continue;}
	log.debug(log.getLineNumber(), log.getFileName(), 'add: ' + dev.ip+':'+ dev.port);	
	clients.push({ipAddress: dev.ip, 
                port: dev.port,
                id: dev.id, 
                aurora: new aurora_server(dev.ip, dev.port)});
}
}
var UIPORT = config.ui.port || '3000'; // port from sphere

/* create http server */
app.listen(UIPORT,function(){
  log.debug(log.getLineNumber(), log.getFileName(), 'runs on: localhost: ' + UIPORT);	
});

app.get("/settings/config",function(req,res){
  //res.sendFile(path.resolve(__dirname + "/../config.json"));
    res.send(config);
});

/* tcp send */
app.post('/setcolor_req/', function(req,res) {
	try{
	var msg = {};
		msg.id = req.body.deviceId;
		//msg.data = req.body.data;
	var done = null;
	var buf = new Buffer([null,null,null]);
	var port = 0;
	var done = false;
	
	log.debug(log.getLineNumber(), log.getFileName(), 'POST: /setcolor_req/');	
	
	if(!Array.isArray(msg.id)){
    var err = 'no device selected';
	 log.error(log.getLineNumber(), log.getFileName(), err);	
		res.status(500).send({ error: err});
	}else{
		for(var i=0;i<clients.length;i++){
			var c = clients[i];
			if(c.color === 'undefined'){log.warn(log.getLineNumber(), log.getFileName(), 'undefined color'); continue;}
			for(var j=0;j<msg.id.length;j++){
				if(c.id === msg.id[j]){
				    log.debug(log.getLineNumber(), log.getFileName(), 'send: ' + c.color + '[' + c.ipAddress + ']');	
				    if(c.brightness){

				    	buf[0] = Math.round(((c.color >> 16) & 0xff) *3 / c.brightness) || 0;
				    	buf[1] = Math.round(((c.color >> 8) & 0xff) *3 / c.brightness) || 0;
				    	buf[2] = Math.round((c.color & 0xff) *3 / c.brightness) || 0;
				    }else{
						//self.client.write(data);
					  	buf[0] = (c.color & 0xff0000) >> 16;
					  	buf[1] = (c.color & 0x00ff00) >> 8;
					  	buf[2] = c.color & 0x0000ff;
				    }
				    
				    c.aurora.setColor(buf, port,function(err,rslt){
						if(!err){
							done = true;
							//res.send(200); //(node:2516) UnhandledPromiseRejectionWarning: Error: Can't set headers after they are sent.
							log.debug(log.getLineNumber(), log.getFileName(), 'send to aurora');	
						}else{
							log.error(log.getLineNumber(), log.getFileName(), 'error: ' + err);
						}
					});

				}
			}
			if(done){
				break;
			}
		}
	}
	if(!done){
    res.status(500).send({ error: 'color is undefined'});
  }else{
    res.status(200).send();
  }
	return;
	}catch(e){
	console.log('ERROR'.red.bold, e);
}
});

app.post('/setrange_req/', function(req,res) {
	try{
	var msg = {};
		msg.range = req.body.range;
		msg.id = req.body.deviceId;
			
	var port = 0x00;
	var buf = new Buffer([null,null,null]);
	
	if(!Array.isArray(msg.id)){
      var err = 'no device selected';
	    log.debug(log.getLineNumber(), log.getFileName(), err);	
	    res.status(500).send({ error: err});
	}else{
		for(var i=0;i<clients.length;i++){
			var c = clients[i];
			for(var j=0;j<msg.id.length;j++){
				if(c.id === msg.id[j]){
					log.debug(log.getLineNumber(), log.getFileName(), 'set range: '.cyan.bold + msg.range[0] +'-'+ msg.range[1] +'color: '+ c.color + ' - ip: '.grey + c.ipAddress +':'+ c.port + ' - id: '.grey + msg.id);	
					 c.range = msg.range;
					 
					if(c.brightness){

					   	buf[0] = Math.round(((c.color >> 16) & 0xff) *3 / c.brightness) || 0;
					   	buf[1] = Math.round(((c.color >> 8) & 0xff) *3 / c.brightness) || 0;
					   	buf[2] = Math.round((c.color & 0xff) *3 / c.brightness) || 0;
								
					}else{
						//self.client.write(data);
						buf[0] = (c.color & 0xff0000) >> 16;
					  	buf[1] = (c.color & 0x00ff00) >> 8;
					 	buf[2] = c.color & 0x0000ff;
						    
					    	
					 }
					c.aurora.clearPixel(function(err){
						if(!err){
							c.aurora.setRange(buf, port, msg.range[0], msg.range[1],function(err){
								if(!err){
									log.debug(log.getLineNumber(), log.getFileName(), 'send to aurora');	
									res.status(200).send();
								}else{
									log.error(log.getLineNumber(), log.getFileName(), 'error: ' + err);
									res.status(500).send({ error: err});
								}
							});
						}else{
							log.error(log.getLineNumber(), log.getFileName(), 'error: ' + err);
							res.status(500).send({ error: err});
						}
					});	
					break;
				}
			}
		}
	}
	return;
}catch(e){
	console.log('ERROR'.red.bold, e);
}

});

/* set color */
app.post('/setcolor/', function(req,res) {
	try{
	var setcolor = null;
	var msg = {};
		//msg.color = parseInt(req.body.colour).toString(16); // string value
		msg.color = req.body.color; // string value
		msg.id = req.body.deviceId;
    
    log.debug(log.getLineNumber(), log.getFileName(), 'POST: /setcolor/');	
    
      if(msg.id === 'undefined'){
	consolelog('ERROR'.red.bold);
}
    
	if(!Array.isArray(msg.id)){
    var err = 'no device selected';
	    log.debug(log.getLineNumber(), log.getFileName(), err);
	    res.status(500).send({ error: err});
	}else{
    
		for(var i=0;i<clients.length;i++){
			var c = clients[i];
			for(var j=0;j<msg.id.length;j++){
				if(c.id === msg.id[j]){
					log.debug(log.getLineNumber(), log.getFileName(), 'set color: '.cyan.bold + msg.color + ' - ip: '.grey + c.ipAddress +':'+ c.port + ' - id: '.grey + msg.id);
					//c.color = msg.color;
					clients[i].color = msg.color;
					setcolor = true;
					res.status(200).send();
					break;
				}
			}
		}
	}
	if(!setcolor){
	    log.error(log.getLineNumber(), log.getFileName(), 'could not set color ip: ' + msg.id);
	    res.status(500).send({ error: 'could not set color id: ' + msg.id});
	}
	return;
	}catch(e){
		console.log('ERROR: ', e);
	}
});

/* set brightness */
app.post('/setbrightness/', function(req,res) {
	try{
	var setbrightness = null;
	var msg = {};
		msg.brightness = req.body.brightness; // string value
		msg.id = req.body.deviceId;
  
	if(!Array.isArray(msg.id)){
    var err = 'no device selected';
		log.error(log.getLineNumber(), log.getFileName(), err);	
		res.status(500).send({ error: err});
	}else{
    
    this.clients = clients;
    for(var i=0;i<this.clients.length;i++){
			var c = clients[i];
			for(var j=0;j<msg.id.length;j++){
				if(c.id === msg.id[j]){
					log.debug(log.getLineNumber(), log.getFileName(), 'set brightness: ' + msg.brightness + ' - ip: '.grey + c.ipAddress +':'+ c.port + ' - id: '.grey + msg.id);

					clients[i].brightness = msg.brightness;
					setbrightness = true;
					res.status(200).send();
					break;
				}
			}
		}
	}
	
	if(!setbrightness){
		log.error(log.getLineNumber(), log.getFileName(), 'could not set brightness id: '.grey + msg.id);
		res.status(500).send({ error: err});
	}
	return;
	}catch(e){
		console.log('ERROR: ', e);
	}
});

app.post('/setPreset/', function(req,res) {
	presets.set(config.presets.path, req.body.file, clients, function(err){
		if(!err){
			res.status(200).send();
		}else{
			log.error(log.getLineNumber(), log.getFileName(), 'set presets: ' + err);
			res.status(500).send({ error: err});
		}	
	});	
	return;
});

app.post('/presets/', function(req,res) {
	presets.load(config.presets.path, function(err,files){
		if(!err){
			res.send(files);
		}else{
			log.error(log.getLineNumber(), log.getFileName(), 'load presets: ' + err);
			res.status(500).send({ error: err});
		}	
	});	
	return;
});

app.post('/effects/', function(req,res) {
	effects.load(config.effects.path, function(err,files){
		if(!err){
			res.send(files);
		}else{
			log.error(log.getLineNumber(), log.getFileName(), 'load effects: ' + err);
			res.status(500).send({ error: err});
		}	
	});	
	return;
});

app.post('/stopEffect/', function(req,res) {
	effects.stop(clients, function(err){
		if(!err){
			res.status(200).send();
		}else{
			log.error(log.getLineNumber(), log.getFileName(), 'run effect: ' + err);
			res.status(500).send({ error: err});
		}	
	});	
	return;
});

app.post('/runEffect/', function(req,res) {
	effects.run(config.effects.path, req.body.file, clients, function(err){
		if(!err){
			res.status(200).send();
		}else{
			log.error(log.getLineNumber(), log.getFileName(), 'run effect: ' + err);
			res.status(500).send({ error: err});
		}	
	});	
	return;
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	// production error handler
	// no stacktraces leaked to user
  app.use(function(err, req, res, next) {    
	  log.error(log.getLineNumber(), log.getFileName(), 'app Error: ' + err);
	  
	res.status(err.status || 500);
    res.render('error', {	
      message: err.message,
      error: err
    });
  });
}
//debug log
//log.msg('info', log.getFileName(), log.getLineNumber(), 'package [iolink] - state [ready]'.cyan.bold);
