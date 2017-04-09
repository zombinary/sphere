
var net = require('net');
var async = require('async');
var assert = require('assert');

var IP = '10.11.0.101';
var PORT = 80;

var client = new net.Socket();

function connect(){
	client.connect(PORT, IP);
}

//describe('connect', function() {
//	it('connect', function(done){
//		//client.connect(1313, '127.0.0.1', function() {
//		client.connect(PORT, IP, function() {
//			done()
//			//client.write('hello, aurora');
//		});
//	});
//});

//client.on('data', function(data) {
//	console.log('Received: ' + data.toString('hex'));
//});

client.on('error', function(data) {
	console.log('error: ' + data);
});

client.on('close', function() {
	console.log('Connection closed');
});

describe('test aurora', function() {
	describe('RED', function() {
		var RED = new Buffer([0xff,0x00,0x00]);
		it('RED', function(done){
			connect();
			client.once('data', function(data){
	    		var d = data;
	            console.log(d);
	            setTimeout(function(){done();},500);	
	    	});
	    	client.write(RED);
	    });
	});
	describe('GREEN', function() {
		var GREEN = new Buffer([0x00,0xff,0x00]);
		it('GREEN', function(done){
			connect();
			client.once('data', function(data){
	    		var d = data.toString('hex');
	    		console.log(d);
	    		setTimeout(function(){done();},500);	
	    	});
	    	client.write(GREEN);
	    });
	});
	describe('BLUE', function() {
		var BLUE = new Buffer([0x00,0x00,0xff]);
	    it('BLUE', function(done){
	    	connect();
	    	client.once('data', function(data){
	    		var d = data.toString('hex');
	    		console.log(d);
	    		setTimeout(function(){done();},500);	
	    	});
	    	client.write(BLUE);
	    });
	});
});

