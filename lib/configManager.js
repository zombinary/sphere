const uuidv1 = require('uuid/v1');
const assert = require('assert');
var log = require('./debug/logging');

/**
 * @module
 * @external configManager
 * @description
 *  load configuration file
 */

 
 /**
 * @class
 * @param {object} path
 */
function CONFIG(path){
  console.log(path);
  var _config = require(path);
  assert(typeof _config === 'object');
  assert(typeof _config.effect === 'object');
  assert(typeof _config.preset === 'object');
  assert(typeof _config.light === 'object');
  assert(Array.isArray(_config.light.devices));
  
  this.light = {
    locations: _config.light.locations,
    devices: addUuid2Devices(_config.light.devices)
  }
  this.preset = _config.preset;
  this.effect = _config.effect;
  this.ui = _config.ui;
}

//CONFIG.prototype.load = function (){return;};

function addUuid2Devices(dev){
  assert(Array.isArray(dev));
  var rslt = dev;
    for(var l=0;l<dev.length;l++){
      rslt[l].id = uuidv1();
      console.log('id" '.red.bold, rslt[l].id);
    }
  return rslt;
}

///**
// * request load
// * @method
// * @param path {String} filepath
// * @param callback.err {Error|null}
// * @param callback.serverEndpoints {Array<EndpointDescription>} the array of endpoint descriptions
//*/
//CONFIG.prototype.load = function (path, callback){callback(null);};

module.exports = function(path){
  return new CONFIG(path);
}