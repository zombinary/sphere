require('colors');
var express = require('express');
var app = express();
var menue = require('./routes/menue');
var pics = require('./routes/pics');

var fs    = require("fs");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engines = require('consolidate');

var conf = require('./config.json');

var TCP = require('./bin/tcp/client');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

//app.set('views', __dirname + '/views');
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
app.use('/', menue);
app.use('/pics', pics);

/* bootstrap, libs & stylesheets */
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/lib'));
app.use(express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, '/public/images')));
app.use(express.static(__dirname + '/public/images'));
app.use(express.static(__dirname + '/node_modules/bootstrap-slider/'));	
app.use(express.static(__dirname + '/node_modules/bootstrap-slider/dist'));
app.use(express.static(__dirname + '/node_modules/bootstrap-slider/src'));

/* create http server */
app.listen(conf.port,function(){
  console.log("Live at Port:\ ", conf.port);
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


app.post('/tcpSend/', function(req,res) {
	//var msg = String.fromCharCode(2)+'sMN SetAccessMode 3 7A99FDC6'+String.fromCharCode(3)+String.fromCharCode(2)+'sWN ADconfig0 1 64 1E 1E 2000 1 1E A 0'+String.fromCharCode(3)+String.fromCharCode(2)+'sMN Run'+String.fromCharCode(3);
	var msg = req.body.myData; // string value
	
	var msg = JSON.stringify(req.body.myData); // json value
	
	//console.log('myData: '.cyan.bold, req.body.myData.toStirng().grey);
	console.log('myData: '.cyan.bold, JSON.stringify(req.body.myData).grey);

	client.write(msg);
   res.send(200);
});


//TCP.setupTcpClient();
var client = TCP();
setTimeout(function(){
		client.write('unicorn');
},1500);
