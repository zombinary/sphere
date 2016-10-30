var express = require('express');
var menue = express.Router();

var path = require('path');

/* bootstrap, libs & stylesheets */
//router.use(express.static(__dirname + '/../lib'));
//router.use(express.static(__dirname + '/../public'));
//router.use(express.static(__dirname + '/../node_modules/bootstrap-slider/dist'));
//router.use(express.static(__dirname + '/../node_modules/bootstrap-slider/src'));

// middleware that is specific to this router
//router.use(function timeLog(req, res, next) {
//  console.log('Time: ', Date.now());
//  next();
//});

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

menue.get("/",function(req,res){
  res.sendFile(path.resolve(__dirname + "/../views/index.html"));
});

menue.get("/settings",function(req,res){
  res.sendFile(path.resolve(__dirname + "/../views/settings.html"));
});

menue.get("/light",function(req,res){
  res.sendFile(path.resolve(__dirname + "/../views/light.html"));
});

menue.get("/aboutUs",function(req,res){
  res.sendFile(path.resolve(__dirname + "/../views/aboutus.html"));
});

menue.get("/contactUs",function(req,res){
  res.sendFile(path.resolve(__dirname + "/../views/contactus.html"));
});



module.exports = menue;
