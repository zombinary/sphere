var util = require("util");
var net = require('net');
var events = require("events");
var log = require('../../lib/debug/logging');
var config = require('../../config.json');


function TCP(ipAddress,port) {
   this.port = port||config.light.port;
   this.ipAddress = ipAddress;
   this.connected = false;
   this.reconnectTime = 3000 || config.general.reconnectTime;
   this.rechableCount = null || config.general.rechableCount;
   events.EventEmitter.call(this);
}
util.inherits(TCP, events.EventEmitter);

TCP.prototype.connect = function(options) {
   if (!this.connected) {
  	   var self = this;
       options = options||{};
       self.options = options;
       self.options.keepalive = options.keepalive||15;
       self.options.clean = self.options.clean||true;
       
       log.debug(log.getLineNumber(), log.getFileName(), 'connect: ' + this.ipAddress+':'+this.port);
         self.client = net.connect(self.port, self.ipAddress, function() {
    	   self.connected = true;
    	   log.debug(log.getLineNumber(), log.getFileName(), 'connect: ' + self.ipAddress+':'+self.port);
    	   self.status = "common.status.connected";
       });
       self.client.on('error', function (err) {
    	   log.error(log.getLineNumber(), log.getFileName(), 'tcp: '+ err.toString());
    	   if(err.code ==='EHOSTUNREACH'){
    		   --self.rechableCount;
    		   log.debug(log.getLineNumber(), log.getFileName(), 'rechableCount: '+ self.rechableCount);   
    	   }
        	   
       });
       self.client.on('end', function (err) {
    	   log.debug(log.getLineNumber(), log.getFileName(), 'tcp: '+ 'end'); 
    	   self.status = 'end';
    	   self.connected = false;
       });
       self.client.on('data', function (data) {
    	   log.debug(log.getLineNumber(), log.getFileName(), 'received: '+ data); 
    	 });
       self.client.on('close', function() {
    	   log.debug(log.getLineNumber(), log.getFileName(), 'socket close');
    	   self.status = "common.status.disconnected";
    	   self.connected = false;
    	   self.client.destroy();
    	   console.log(self.rechableCount);
           if(self.rechableCount){
                setTimeout(self.connect(),config.reconnectTime);
            }else {
              //log.error(log.getLineNumber(), log.getFileName(), 'start reconnectInterval: ' + self.ipAddress);
              //self.rechableCount = config.general.rechableCount;
             //Todo: setInterval config.reconnectInervalTime
          }
  
       });
         
   }
   return;
};

TCP.prototype.send = function(data) {
  var self = this;
  var buf = new Buffer([null,null,null]);
  if (self.connected) {
  	log.debug(log.getLineNumber(), log.getFileName(), 'send: ' + data);
  	self.client.write(data);
  }
  return;
};

TCP.prototype.disconnect = function() {
   var self = this;
   if (this.connected) {
       this.connected = false;
       try {
    	   log.debug(log.getLineNumber(), log.getFileName(), 'disconnect: ' + self.ipAddress);
           this.client.disconnect();
       } catch(err) {
       }
   }
   return;
};

TCP.prototype.isConnected = function() {
    return this.connected;
};

module.exports.createClient = function(ipAddress, port) {
   var tcp_client = new TCP(ipAddress, port);
   return tcp_client;
};
