var net = require('net');

var IP = '127.0.0.1';
var PORT = '1313';


var server = net.createServer(function(socket) {
	//socket.pipe(socket);
	
	socket.on('data', function(data) {
		var buf = null;
		console.log('data: ' + data.toString('hex'));
		if(data.toString('hex') === '090013000003ff0000'){
			buf = new Buffer([0x05,0x00,0x13,0x03,0x00]);
		}else if(data.toString('hex') === '07001503ff0000'){
		   buf = new Buffer([0x05,0x00,0x15,0x03,0x00]);
		}
		if(buf){
			socket.write(buf);
		}else{
			socket.write(data);
		}	
		
	});

	socket.on('error', function(err) {
		console.log('error: ' + err);
	});

});

console.log('aurora simulate: \n');
console.log('\t ip: ', PORT);
console.log('\t port: ', IP );

server.listen(PORT, IP);