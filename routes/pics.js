var fs    = require("fs");
var path = require('path');

var express = require('express');
var pics = express.Router();

var path = require('path');

pics.get("/pics",function(req,res){
  //res.sendFile(path + "contact.html");
  //res.writeHead(200, {'Content-Type': 'image/png' });

 	console.log(__dirname + '/../public/images/pixel.jpg');
 
 fs.readFile(path.resolve(__dirname + '/../public/images/pixel.jpg'), function(err, data) {
  	if (err) throw err; // Fail if the file can't be read
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data); // Send the file data to the browser.
  });
});


pics.get("/pics/slider1",function(req,res){
  fs.readFile(__dirname + '/../public/images/bike.jpg', function(err, data) {
  	if (err) throw err; // Fail if the file can't be read
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data); // Send the file data to the browser.
  });
});

pics.get("/pics/slider2",function(req,res){
  fs.readFile(__dirname + '/../public/images/bike_2.jpg', function(err, data) {
  	if (err) throw err; // Fail if the file can't be read
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data); // Send the file data to the browser.
  });
});

module.exports = pics;




