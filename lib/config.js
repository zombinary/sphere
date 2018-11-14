const uuidv1 = require('uuid/v1');
const assert = require('assert');
var log = require('./debug/logging');

function addUuidtoDevices(conf){
	var area = conf.area;
	for(var a=0;a<area.length;a++){
		var dev = area[a].devices;
		for(var l=0;l<dev.length;l++){
			area[a].devices[l].uuid = uuidv1();
		}
	}
	return area;
}

function config(path){
	this._config = require(path);
	assert(typeof this._config === 'object');
	assert(this._config.light);
	assert(this._config.light.area);
	this.devices = addUuid2Devices(this._config.light);
	return;
}


module.exports = function(path){
		return new config(path);
}
