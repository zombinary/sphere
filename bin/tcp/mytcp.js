var util = require("util");
var net = require('net');
var events = require("events");

function MYTCPClient(ipAddress,port) {
   this.port = port||80;
   this.ipAddress = ipAddress;
   this.connected = false;
   this.end = false;
   this.reconnectTime = 3000;
   events.EventEmitter.call(this);
}
util.inherits(MYTCPClient, events.EventEmitter);

//MYTCPClient.prototype.connect = function(options) {
//   if (!this.connected) {
//       var self = this;
//       options = options||{};
//       self.options = options;
//       self.options.keepalive = options.keepalive||15;
//       self.options.clean = self.options.clean||true;
//       self.client = net.connect(this.port,this.host,function(err,client) {
//             if (err) {
//                self.connected = false;
//                clearInterval(self.watchdog);
//                self.connectionError = true;
//                //util.log('[mqtt] ['+self.uid+'] connection error 1 : '+inspect(err));
//                self.emit('connectionlost',err);
//                return;
//             }
//             client.on('close',function(e) {
//                   //util.log('[mqtt] ['+self.uid+'] on close');
//                   clearInterval(self.watchdog);
//                   if (!self.connectionError) {
//                       if (self.connected) {
//                          self.connected = false;
//                          self.emit('connectionlost',e);
//                       } else {
//                          self.emit('disconnect');
//                       }
//                   }
//             });
//             client.on('error',function(e) {
//                   //util.log('[mqtt] ['+self.uid+'] on error : '+inspect(e));
//                   clearInterval(self.watchdog);
//                   if (self.connected) {
//                      self.connected = false;
//                      self.emit('connectionlost',e);
//                   }
//             });
//             client.on('connack',function(packet) {
//                   if (packet.returnCode == 0) {
//                      self.watchdog = setInterval(function(self) {
//                            var now = (new Date()).getTime();
//                            //util.log('[mqtt] ['+self.uid+'] watchdog '+inspect({connected:self.connected,connectionError:self.connectionError,pingOutstanding:self.pingOutstanding,now:now,lastOutbound:self.lastOutbound,lastInbound:self.lastInbound}));
//                            if (now - self.lastOutbound > self.options.keepalive*500 || now - self.lastInbound > self.options.keepalive*500) {
//                               if (self.pingOutstanding) {
//                                  //util.log('[mqtt] ['+self.uid+'] watchdog pingOustanding - disconnect');
//                                  try {
//                                     self.client.disconnect();
//                                  } catch (err) {
//                                  }
//                               } else {
//                                  //util.log('[mqtt] ['+self.uid+'] watchdog pinging');
//                                  self.lastOutbound = (new Date()).getTime();
//                                  self.lastInbound = (new Date()).getTime();
//                                  self.pingOutstanding = true;
//                                  self.client.pingreq();
//                              }
//                            }
//                      },self.options.keepalive*500,self);
//                      self.pingOutstanding = false;
//                      self.lastInbound = (new Date()).getTime()
//                      self.lastOutbound = (new Date()).getTime()
//                      self.connected = true;
//                      self.connectionError = false;
//                      self.emit('connect');
//                   } else {
//                      self.connected = false;
//                      self.emit('connectionlost');
//                   }
//             });
//             client.on('suback',function(packet) {
//                   self.lastInbound = (new Date()).getTime()
//                   var topic = self.pendingSubscriptions[packet.messageId];
//                   self.emit('subscribe',topic,packet.granted[0]);
//                   delete self.pendingSubscriptions[packet.messageId];
//             });
//             client.on('unsuback',function(packet) {
//                   self.lastInbound = (new Date()).getTime()
//                   var topic = self.pendingSubscriptions[packet.messageId];
//                   self.emit('unsubscribe',topic);
//                   delete self.pendingSubscriptions[packet.messageId];
//             });
//             client.on('publish',function(packet) {
//                   self.lastInbound = (new Date()).getTime();
//                   if (packet.qos < 2) {
//                      var p = packet;
//                      self.emit('message',p.topic,p.payload,p.qos,p.retain);
//                   } else {
//                      self.inboundMessages[packet.messageId] = packet;
//                      this.lastOutbound = (new Date()).getTime()
//                      self.client.pubrec(packet);
//                   }
//                   if (packet.qos == 1) {
//                      this.lastOutbound = (new Date()).getTime()
//                      self.client.puback(packet);
//                   }
//             });
//             client.on('pubrel',function(packet) {
//                   self.lastInbound = (new Date()).getTime()
//                   var p = self.inboundMessages[packet.messageId];
//                   if (p) {
//                       self.emit('message',p.topic,p.payload,p.qos,p.retain);
//                       delete self.inboundMessages[packet.messageId];
//                   }
//                   self.lastOutbound = (new Date()).getTime()
//                   self.client.pubcomp(packet);
//             });
//	            client.on('puback',function(packet) {
//	                  self.lastInbound = (new Date()).getTime()
//	                   // outbound qos-1 complete
//             });
//             client.on('pubrec',function(packet) {
//                   self.lastInbound = (new Date()).getTime()
//                  self.lastOutbound = (new Date()).getTime()
//                   self.client.pubrel(packet);
//             });
//             client.on('pubcomp',function(packet) {
//                   self.lastInbound = (new Date()).getTime()
//                   // outbound qos-2 complete
//             });
//             client.on('pingresp',function(packet) {
//                   //util.log('[mqtt] ['+self.uid+'] received pingresp');
//                   self.lastInbound = (new Date()).getTime()
//                   self.pingOutstanding = false;
//             });
//             this.lastOutbound = (new Date()).getTime()
//             this.connectionError = false;
//             client.connect(self.options);
//       });
//   }
//}
	
MYTCPClient.prototype.connect = function(options) {
   if (!this.connected) {
  	   var self = this;
       options = options||{};
       self.options = options;
       self.options.keepalive = options.keepalive||15;
       self.options.clean = self.options.clean||true;
       
       //console.log('this: '.red.bold, this);
       
       util.log('[mytcp] connect: '.cyan.bold + this.ipAddress.toString().grey+':'.grey+this.port.toString().grey);
       /*
       self.client = net.connect(self.port, self.ipAddress, function(err) {
      	 if(!err){
      		 self.connected = true;
		       console.log("tcp connect: ".cyan.bold, self.ipAddress.toString().grey+':'.grey+self.port.toString().grey);    
		       
           self.watchdog = setInterval(function(self) {
             var now = (new Date()).getTime();

             //util.log('[mqtt] ['+self.uid+'] watchdog '+inspect({connected:self.connected,connectionError:self.connectionError,pingOutstanding:self.pingOutstanding,now:now,lastOutbound:self.lastOutbound,lastInbound:self.lastInbound}));

             if (now - self.lastOutbound > self.options.keepalive*500 || now - self.lastInbound > self.options.keepalive*500) {
                if (self.pingOutstanding) {
                   //util.log('[mqtt] ['+self.uid+'] watchdog pingOustanding - disconnect');
                   try {
                      self.client.disconnect();
                   } catch (err) {
                   }
                } else {
                   //util.log('[mqtt] ['+self.uid+'] watchdog pinging');
                   self.lastOutbound = (new Date()).getTime();
                   self.lastInbound = (new Date()).getTime();
                   self.pingOutstanding = true;
                   self.client.pingreq();
                }
             }
           	},self.options.keepalive*500,self);
           
           	self.lastInbound = (new Date()).getTime()
       			self.lastOutbound = (new Date()).getTime()
       			self.connected = true;
       			self.connectionError = false;
       			self.emit('connect');
       
       			this.lastOutbound = (new Date()).getTime()
       			this.connectionError = false;
       			client.connect(self.options);
      		 
      	 }else{
      		 if (err) {
             self.connected = false;
             clearInterval(self.watchdog);
             self.connectionError = true;
             self.emit('connectionlost',err);
             return;
          }
      		 
      	 }
     });
     */
       self.client = net.connect(self.port, self.ipAddress, function() {
    	   self.connected = true;
    	   util.log('[mytcp] connect: '.green.bold + self.ipAddress.toString().grey+':'.grey+ self.port.toString().grey);
    	   self.status = "common.status.connected";
       });
       self.client.on('error', function (err) {
    	   console.log()
           console.log("tcpin.errors.error",{error:err.toString()});
       });
       self.client.on('end', function (err) {
    	   self.status = 'end';
    	   self.connected = false;
       });
       self.client.on('data', function (data) {
           console.log('received data: ', data.toString());
       });
       self.client.on('close', function() {
    	   self.status = "common.status.disconnected";
    	   self.connected = false;
    	   self.client.destroy();
           if (!self.closing) {
               if (self.end) {
            	   self.end = false;
                   reconnectTimeout = setTimeout(self.connect(),20);
               }else {
                    console.log("tcpin.errors.connection-lost",self.ipAddress,self.port);
                      reconnectTimeout = setTimeout(self.connect(),self.reconnectTime);
               }
           }else{
              if (self.done) { self.done(); }
           }
       });
         
   }
   return;
};

MYTCPClient.prototype.send = function(data) {
  var self = this;
  if (self.connected) {
  	// data ==> hexstring
	  util.log('[mytcp] send: '.cyan.bold + data.toString().grey);	
     self.client.write(data);
  }
  return;
};

MYTCPClient.prototype.disconnect = function() {
   var self = this;
   if (this.connected) {
       this.connected = false;
       try {
           this.client.disconnect();
       } catch(err) {
       }
   }
   return;
};

MYTCPClient.prototype.isConnected = function() {
    return this.connected;
};

module.exports.createClient = function(ipAddress, port) {
   var tcp_client = new MYTCPClient(ipAddress, port);
   return tcp_client;
};
