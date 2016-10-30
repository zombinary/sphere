var net = require('net');

var tcp = { 	'host': '127.0.0.1',
					'port': 1313,
					'connected': false,
					'datatype': '',
					'status': ''
					
}

var reconnectTime = 10000;
var reconnectTimeout;
var client = null;
var end = false;

			/tcp out/
			var setupTcpClient = function() {
                console.log("tcpin.status.connecting",tcp.host,tcp.port);
                tcp.status = 'common.status.connecting';
                client = net.connect(tcp.port, tcp.host, function() {
                    tcp.connected = true;
                    console.log("tcpin.status.connected",tcp.host,tcp.port);
                    tcp.status = "common.status.connected";
                });
                client.on('error', function (err) {
                    console.log("tcpin.errors.error",{error:err.toString()});
                });
                client.on('end', function (err) {
                    tcp.status = 'end';
                    tcp.connected = false;
                });
                client.on('data', function (data) {
                    console.log('received data: ', data.toString());
                });
                client.on('close', function() {
                    tcp.status = "common.status.disconnected";
                    tcp.connected = false;
                    client.destroy();
                    if (!tcp.closing) {
                        if (end) {
                            end = false;
                            reconnectTimeout = setTimeout(setupTcpClient,20);
                        }
                        else {
                            console.log("tcpin.errors.connection-lost",tcp.host,tcp.port);
                            reconnectTimeout = setTimeout(setupTcpClient,reconnectTime);
                        }
                    } else {
                        if (tcp.done) { tcp.done(); }
                    }
                });
                return client;
            }
            
 module.exports = setupTcpClient;           
            