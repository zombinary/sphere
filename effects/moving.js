var net = require('net');
var async = require('async');
var assert = require('assert');

var IP = '10.11.0.102';
var PORT = 80;


var MAX_PIXEL = 384;  
var PIXELPIN = 0;
var MAXPORT = 2;
var TIMEOUT = 250;
var STROBE = 5;

var color = 0;
var count = 0;
var CMD_SETPIXEL = new Buffer([0x09,0x00,0x13,PIXELPIN,count,0x00,0x00,0xff,0x00]);
var CMD_CLEARPIXEL = new Buffer([0x03,0x00,0x12]);
var led_pb1 = 0;


var socketopen = false;
var client = new net.Socket();
  
function connect(callback){
	if(!socketopen){
		client.connect(PORT, IP, function(err){
			socketopen = true;
			callback();
		});
	}else{
		callback();
	}	
}
client.on('error', function(data) {
	console.log('error: ' + data);
});


client.on('close', function() {
	//client.destroy();
	console.log('\t Connection closed');
});

client.on('end', function(data) {
	console.log('\t end');
	socketopen = false;
});


client.on('data', function(data) {
	console.log('data: ' + data.toString('hex'));
});
		
async.whilst(
    function() { return 1;},
    function(callback) {
    	setTimeout(function(){
			connect(function(){
    			client.write(CMD_CLEARPIXEL, function(){
    				CMD_SETPIXEL[3] = 0x00;//PIXELPIN;
    	    		CMD_SETPIXEL[4] = count;
    	    		client.write(CMD_SETPIXEL, function(){
    	    			if(count === MAX_PIXEL-1){
    	            	if(color === 0){
	    	    			CMD_SETPIXEL = new Buffer([0x09,0x00,0x13,PIXELPIN,count,0x00,0xff,0xff,0xff]);
	    	    			color++;
	    	    		}else if( color === 1){
	    	    			CMD_SETPIXEL = new Buffer([0x09,0x00,0x13,PIXELPIN,count,0x00,0x00,0xff,0x00]);
	    	    			color++;
	    	    		}else if(color === 2){
	    	    			CMD_SETPIXEL = new Buffer([0x09,0x00,0x13,PIXELPIN,count,0x00,0x00,0x00,0xff]);
	    	    			color = 0;
	    	    		}
	            		count = 0;
	            		}else{
	            			count++;	
	            		}
     				});
    			});
    			client.emit('close', callback(null));
    		});
    			
    		
	 	},TIMEOUT);
    },
    function (err, n) {
    	//client.end(PORT, IP);
    }
);
