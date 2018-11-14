var express = require('express');
var menue = express.Router();

var path = require('path');

menue.get("/",function(req,res){
  res.sendFile(path.resolve(__dirname + "/../views/index.html"));
});

menue.get("/remote",function(req,res){
  res.sendFile(path.resolve(__dirname + "/../views/remote.html"));
});

menue.get("/settings",function(req,res){
  res.sendFile(path.resolve(__dirname + "/../views/settings.html"));
});

//menue.get("/settings/config",function(req,res){
//	  res.sendFile(path.resolve(__dirname + "/../config.json"));
//	});

menue.get("/presets",function(req,res){
	   res.sendFile(path.resolve(__dirname + "/../views/presets.html"));
	});

menue.get("/effects",function(req,res){
	   res.sendFile(path.resolve(__dirname + "/../views/effects.html"));
});

menue.get("/test",function(req,res){
   res.sendFile(path.resolve(__dirname + "/../views/test.html"));
});

module.exports = menue;
