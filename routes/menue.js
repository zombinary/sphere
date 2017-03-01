var express = require('express');
var menue = express.Router();

var path = require('path');

menue.get("/",function(req,res){
  res.sendFile(path.resolve(__dirname + "/../views/index.html"));
});

menue.get("/light",function(req,res){
  res.sendFile(path.resolve(__dirname + "/../views/light.html"));
});

menue.get("/settings",function(req,res){
  res.sendFile(path.resolve(__dirname + "/../views/settings.html"));
});

module.exports = menue;
