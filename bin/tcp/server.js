
var http = require('http');

http.createServer(function(request, response){

  response.writeHead(200);

  request.on('data', function(msg){
   console.log('request data: ', msg.toString());
   //response.write(msg);
  });

  request.on('end', function(){
    response.end();
  });

}).listen(8080);


module.exports = http;