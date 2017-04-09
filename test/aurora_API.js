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
	describe('CMD_SETPIXEL', function() {
		var CMD_SETPIXEL = new Buffer([0x09,0x00,0x13,0x00,0x00,0x03,0xff,0x00,0x00]);
	    it('CMD_SETPIXEL', function(done){
	    	client.once('data', function(data){
	    		var d = data.toString('hex');
	            assert.equal(d, '0500130300');
	            done();	
	    	});
	    	connect();
	    	client.write(CMD_SETPIXEL);
	    });
	});
	describe('CMD_SETCOLOR', function() {
	var CMD_SETCOLOR = new Buffer([0x07,0x00,0x15,0x03,0xff,0x00,0x00]);
		it('CMD_SETCOLOR', function(done){
			client.once('data', function(data){
				var d = data.toString('hex');
				assert.equal(d, '0500150300');
				done();
			});
			connect();
			client.write(CMD_SETCOLOR);
		});
	});
	describe('close', function() {
		it('close', function(done){
			client.emit('close',done);
		});
	});
});