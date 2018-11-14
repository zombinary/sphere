var net = require('net');
var async = require('async');
var assert = require('assert');
var aurora_server = require('gravity-aurora');

var IP = '10.11.0.102';
var PORT = 80;

var aurora = new aurora_server(IP,PORT);

var MAX_PIXEL = 384;  
var PIXELPIN = 0;
var MAXPORT = 2;
var TIMEOUT = 750;
var STROBE = 5;

async.whilst(
		function() { 
				var color = new Buffer ([0x00,0x00,0x19]);
				aurora.setColor(color, 0, function(err){
					//calback();
				});
				return 1;
			},function(callback) {
			setTimeout(function(){
				var pxl = Math.ceil(Math.random() * MAX_PIXEL) -1;
				aurora.setPixel([0x00,0xff,0x00], 0,  pxl, function(err){
					callback();
				});
	   },TIMEOUT);
   },function (err, n) {
});



