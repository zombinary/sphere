var net = require('net');

var IP = '127.0.0.1';
var PORT = '1313';


var server = net.createServer(function(socket) {
	socket.pipe(socket);
	
	socket.on('data', function(data) {
		console.log('data: ' + data);
	});

	socket.on('error', function(err) {
		console.log('error: ' + err);
	});

});

console.log('echoserver: \n');
console.log('\t ip: ', PORT);
console.log('\t port: ', IP );

server.listen(PORT, IP);