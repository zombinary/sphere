var net = require('net');
var async = require('async');
var assert = require('assert');

var IP = '10.11.0.101';
var PORT = 80;
var TIMEOUT = 500;

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
//	console.log('Received hex: ' + data.toString('hex'));
//});

client.on('error', function(data) {
	console.log('error: ' + data);
});

client.on('close', function() {
	console.log('\t Connection closed');
});

describe('test aurora', function() {
// CMD_SETPIXEL
//
// set color value of single pixel
//
// 	byte	| description
// 	-------------------------------------------------
//		0	|	length low byte first	
//		1	|	length
//		2	|	CMD_SETPIXEL = 0x13
//		3	|	pixel high byte first
//		4	|	pixel 
//		5	|	port
//		6	|	color value red
//		7	|	color value green
//		8	|	color value blue
	
	describe('CMD_SETPIXEL', function() {
		describe('RED', function() {
			var CMD_SETPIXEL = new Buffer([0x09,0x00,0x13,0x00,0x03,0x03,0xff,0x00,0x00]);
			it('CMD_SETPIXEL', function(done){
				client.once('data', function(data){
					var d = data.toString('hex');
					console.log('\t request: ', d);
					assert.equal(d, '04001303');
					setTimeout(function(){done();}, TIMEOUT);	
				});
				connect();
				client.write(CMD_SETPIXEL);
			});
		});
		describe('GREEN', function() {
			var CMD_SETPIXEL = new Buffer([0x09,0x00,0x13,0x00,0x03,0x03,0x00,0xff,0x00]);
			it('CMD_SETPIXEL', function(done){
				client.once('data', function(data){
					var d = data.toString('hex');
					console.log('\t request: ', d);
					assert.equal(d, '04001303');
					setTimeout(function(){done();}, TIMEOUT);	
				});
				connect();
				client.write(CMD_SETPIXEL);
			});
		});
		describe('BLUE', function() {
			var CMD_SETPIXEL = new Buffer([0x09,0x00,0x13,0x00,0x03,0x03,0x00,0x00,0xff]);
			it('CMD_SETPIXEL', function(done){
				client.once('data', function(data){
					var d = data.toString('hex');
					console.log('\t request: ', d);
					assert.equal(d, '04001303');
					setTimeout(function(){done();}, TIMEOUT);	
				});
				connect();
				client.write(CMD_SETPIXEL);
			});
		});
	});	
// CMD_SETCOLOR
//
// set color of all pixel
//
//	 	byte	| description
//	 	-------------------------------------------------
//			0	|	length low byte first	
//			1	|	length
//			2	|	CMD_SETPIXEL
//			3	|	port
//			4	|	color value red
//			5	|	color value green
//			6	|	color value blue
			
	describe('CMD_SETCOLOR', function() {
		describe('RED', function() {
			var CMD_SETCOLOR = new Buffer([0x08,0x00,0x15,0x03,0xff,0x00,0x00]);
			it('CMD_SETCOLOR', function(done){
				client.once('data', function(data){
					var d = data.toString('hex');
					console.log('\t request: ', d);
					assert.equal(d, '04001503');
					setTimeout(function(){done();}, TIMEOUT);
				});
				connect();
				client.write(CMD_SETCOLOR);
			});
		});
		describe('GREEN', function() {
			var CMD_SETCOLOR = new Buffer([0x08,0x00,0x15,0x03,0x00,0xff,0x00]);
			it('CMD_SETCOLOR', function(done){
				client.once('data', function(data){
					var d = data.toString('hex');
					console.log('\t request: ', d);
					assert.equal(d, '04001503');
					setTimeout(function(){done();}, TIMEOUT);
				});
				connect();
				client.write(CMD_SETCOLOR);
			});
		});
		describe('BLUE', function() {
			var CMD_SETCOLOR = new Buffer([0x08,0x00,0x15,0x03,0x00,0x00,0xff]);
			it('CMD_SETCOLOR', function(done){
				client.once('data', function(data){
					var d = data.toString('hex');
					console.log('\t request: ', d);
					assert.equal(d, '04001503');
					setTimeout(function(){done();}, TIMEOUT);
				});
				connect();
				client.write(CMD_SETCOLOR);
			});
		});	
	});
	describe('close', function() {
		it('close', function(done){
			client.emit('close', done());
		});
	});
});