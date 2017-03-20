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
var port = 80;
var TCP = require('./bin/tcp/pool');
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
		util.log('[sphere] add: '.cyan.bold +config.light.server[i].device[j].ip.toString().grey+':'.grey+port.toString().grey);
		client.push({ ipAddress: config.light.server[i].device[j].ip, client: TCP.get(config.light.server[i].device[j].ip, port)});
	}
}

/* connect to all clients */
for(var i=0; i<client.length;i++){
	util.log('[sphere] connect: '.cyan.bold + client[i].ipAddress.toString().grey+':'.grey+port.toString().grey);
	client[i].client.connect();
}



/* create http server */
app.listen(config.port,function(){
  util.log('[sphere] runs on: '.green.bold + 'localhost:'.grey + config.port.toString().grey);
});

/* tcp send */
app.post('/tcpSend/', function(req,res) {
	var msg = {};
		msg.data = parseInt(req.body.myData).toString(16); // string value

	if(!req.body.ip){
		util.log('[sphere] tcp send: '.cyan.bold + 'ERROR: '.red  + 'no device selected');
	}else{
		msg.ip = req.body.ip;
		
		/* convert int2hex string with fix length of 6chars */
		var hexstr = '000000';
		    hexstr = hexstr.slice(msg.data.length);
		    hexstr = hexstr + msg.data;
		
	    util.log('[sphere] tcp send: '.cyan.bold + msg.data.toString().grey + ' - ip: '.grey + msg.ip.toString().grey);
		    
			    
		for(var i=0;i<client.length;i++){
			for(var j=0;j<msg.ip.length;j++){
				if(client[i].ipAddress === msg.ip[j]){
					util.log('[sphere] send: '.cyan.bold + hexstr.toString().grey+'['.grey +client[i].ipAddress.toString().grey + ']'.grey);
					client[i].client.send(hexstr);
					break;
				}
			}
		}
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


