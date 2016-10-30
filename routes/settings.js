var express = require('express');
var settings = express.Router();
var fs = require('fs');

var path = require('path');

settings.get("/settings/config",function(req,res){
	fs.readFile(__dirname + '/../config.json', function(err, data) {
  	if (err){
  		throw err;
  	}else{
  		var json = JSON.parse(data); 				
	    res.send(json);  	  
 		};
  });
 
});

module.exports = settings;
