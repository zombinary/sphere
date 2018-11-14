var fs = require ('fs');

var log = require ('../lib/debug/logging');
//var config = require ('../config.json');

/* load 
 * 
 * param path [in] - path to preset files
 * param callback [in] - callback function return list of files
 */
function load(path, callback){
	log.debug(log.getLineNumber(), log.getFileName(), 'presets path: ' + path);
	fs.readdir(path, function(err,files){
		if(!err){
			log.debug(log.getLineNumber(), log.getFileName(), 'load presets: ' + files);
			var f = [];

			/* load files with index '.json' only */
			for(var i =0; i<files.length; i++ ){
				var tmp = files[i];
				if(tmp.substring(tmp.length-5,tmp.length) === '.json'){
					f.push(tmp.split('.json')[0]);
				}
			}
			if(!f.length){
				log.warn(log.getLineNumber(), log.getFileName(), 'no presets found: '.grey + path.toString().grey);
			}
				
			callback(null, f);	
		}else{
			log.error(log.getLineNumber(), log.getFileName(), 'load presets: ' + err);
			callback(err);
		}
	});
}

function setColor(client, preset, callback){
	var found = false;
	var json = preset;
	/* read all devices */
	for(var d=0; d<json.device.length; d++){
		var dev = json.device[d];
		console.log('dev.ip: '.red.bold, dev.ip);
		if(!dev.pin){continue;};
		/* pin of device */
		for(var pin=0; pin<dev.pin.length; pin++){
			var dev_pin = dev.pin[pin];  
			if(!dev_pin.color){continue;};
			if(!dev_pin.color.length === 3){continue;};
			
			/* find client */
			for(var c=0; c<client.length;c++){
				var cl = client[c];
				if(cl.ipAddress === dev.ip){
					log.debug(log.getLineNumber(), log.getFileName(), 'preset set color'.grey);
					cl.aurora.setColor(dev_pin.color, pin, function(err){
						if(err){
							log.err(log.getLineNumber(), log.getFileName(), 'preset set color: '.grey + err);
						}
					});
					found = true;
					break;
				}
			}
		}
	}	
	if(!found){
		callback('error set color');
	}else{
		callback(false);
	}
}

function setRange(client, preset, callback){
	var found = false;
	var json = preset;
	/* read all devices */
	for(var d=0; d<json.device.length; d++){
		var dev = json.device[d];
		if(!dev.pin){continue;};
		/* pin of device */
		for(var pin=0; pin<dev.pin.length; pin++){
			var dev_pin = dev.pin[pin];  
			/* find client */
			for(var c=0; c<client.length;c++){
				var cl = client[c];
				if(!cl.ipAddress){continue;};
				if(cl.ipAddress === dev.ip){
					if(!dev_pin.element){continue;};
					/* read range settings */
					for(var r=0; r<dev_pin.element.length;r++){
						var range = dev_pin.element[r];
						if(!range.range){continue;};
						if(!range.range === 2){continue;};
						if(!range.color){continue;};
						if(!range.color.length === 3){continue;};
						log.debug(log.getLineNumber(), log.getFileName(), 'preset set range: '.grey + range.range[0].toString().grey +'-'+ range.range[1].toString().grey);
						cl.aurora.setRange(range.color, pin, range.range[0], range.range[1], function(err){
							if(!err){
								log.err(log.getLineNumber(), log.getFileName(), 'preset set range: '.grey + err);
							}
						});
					}
					found = true;
					break;
				}
			}	
		}
	}	
	if(!found){
		callback('error set range');
	}else{
		callback(false);
	}
}

function setPixel(client, preset, callback){
	var found = false;
	var json = preset;
	/* read all devices */
	for(var d=0; d<json.device.length; d++){
		var dev = json.device[d];
		
		if(!dev.pin){continue;};
		/* pin of device */
		for(var pin=0; pin<dev.pin.length; pin++){
			var dev_pin = dev.pin[pin];  
			/* read pixel settings */
			for(var p=0; p<dev_pin.pixel.length;p++){
				var pxl = dev_pin.pixel[p];
				if(!pxl.color){continue;};
				if(!pxl.color.length === 3){continue;};
				
				/* find client */
				for(var c=0; c<client.length;c++){
					var cl = client[c];
				
					if(cl.ipAddress === dev.ip){
						log.debug(log.getLineNumber(), log.getFileName(), 'preset set pixel: '.grey + pxl.nb.toString().grey);
						cl.aurora.setPixel(pxl.color, pin, pxl.nb, function(err){
							if(err){
								log.err(log.getLineNumber(), log.getFileName(), 'preset set pixel: '.grey + err);
							}
						});
						found = true;
						break;
					}
				}
			}
		}
	}
	if(!found){
		callback('error set range');
	}else{
		callback(false);
	}
}

/* set 
 * 
 * load file and set color of pixel
 * 
 * param path [in] - path to preset files
 * param file [in] - preset filename	
 * param callback [in] - callback function return true/false
 */
function set(path, file, client ,callback){
	log.debug(log.getLineNumber(), log.getFileName(), 'setPreset: '.grey + file.grey);
	
	fs.readFile(path + '/'+ file + '.json', function(err,fsdata){
		if(!err){
			log.debug(log.getLineNumber(), log.getFileName(), 'read file');
			
			setColor(client, JSON.parse(fsdata), function(err){
				setRange(client, JSON.parse(fsdata), function(err){
						setPixel(client, JSON.parse(fsdata), callback);
				});
			});
				
		}else{
			log.error(log.getLineNumber(), log.getFileName(), 'load presets: ' + err);
			callback(err);
		}
	});
	
	//callback(false);
};


module.exports = {
	set: set,	
	load: load
}