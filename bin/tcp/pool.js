var util = require("util");
var mytcp = require("./mytcp");

var connections = {};

module.exports = {
		get: function(ipAddress, port){
			var id = ipAddress+":"+port;
			if(!connections[id]) {
				connections[id] = function() {
					var uid = (1+Math.random()*4294967295).toString(16);
					var client = mytcp.createClient(ipAddress, port);
		      		client.uid = uid;
		      
		      var options = {keepalive:15};
		      //			options.username = username;
		      //			options.password = password;
		      var queue = [];
		      var connecting = false;
		      
          var obj = {
              _instances: 0,
              connect: function() {
                if (client && !client.isConnected() && !connecting) {
                    connecting = true;
                    client.connect(options);
                }
            },
            send: function(data) {
              if (client.isConnected()) {
                client.send(data);
            } else {
                if (!connecting) {
                    connecting = true;
                    client.connect(options);
                }
                queue.push(data);
            }
        },
            disconnect: function(ref) {

              this._instances -= 1;
              if (this._instances == 0) {
                  client.disconnect();
                  client = null;
                  delete connections[id];
              }
          },
          isConnected: function() {
            return client.isConnected();
          }
       };
       client.on('connectionlost', function(err) {
          util.log('[tcp] ['+uid+'] connectionlost: '.cyan.bold+ipAddress.toString().grey+':'.grey+port.toString().grey);
          connecting = false;
          setTimeout(function() {
              obj.connect();
          }, config.reconnectTime||5000);
      });   
       client.on('connect',function() {
      	 if(client) {
      		 util.log('[tcp] ['+uid+'] connect://'+ipAddress+':'+port);
      	 }
       });
       client.on('connectionlost', function(err) {
          	util.log('[tcp] ['+uid+'] lost://'+ipAddress+':'+port);
          	
            connecting = false;
            setTimeout(function() {
                obj.connect();
            }, settings.myTcpReconnectTime||5000);
          });
      client.on('disconnect', function() {
      	connecting = false;
        util.log('[tcp] ['+uid+'] disconnect://'+ipAddress+':'+port);
      });

      return obj
      }();
    }
    connections[id]._instances += 1;
    return connections[id];
	}
};    
        