var fs = require ('fs');
var cluster = require('cluster');


var log = require ('../lib/debug/logging');
//var config = require ('../config.json');

/* load 
 * param path [string] - path to effect files
 * param callback [in] - callback function return list of files
 */
function load(path, callback){
	log.debug(log.getLineNumber(), log.getFileName(), 'effects path: ' + path);
	fs.readdir(path, function(err,files){
		if(!err){
			log.debug(log.getLineNumber(), log.getFileName(), 'load effects: ' + files);
			var f = [];

			/* load files with index '.json' only */
			for(var i =0; i<files.length; i++ ){
				var tmp = files[i];
				if(tmp.substring(tmp.length-3,tmp.length) === '.js'){
					f.push(tmp.split('.js')[0]);
				}
			}
			if(!f.length){
				log.warn(log.getLineNumber(), log.getFileName(), 'no effects found: '.grey + path.toString().grey);
			}
				
			callback(null, f);	
		}else{
			log.error(log.getLineNumber(), log.getFileName(), 'load effects: ' + err);
			callback(err);
		}
	});
}

/* set 
 * 
 * load file and fork script
 * 
 * param path [in] - path to effect file whih are fork
 * param client [in]- client instance 
 * param file [in] - fork skript to run effects	
 * param callback [in] - callback function return true/false
 */
function run(path, file, client, callback){
	log.debug(log.getLineNumber(), log.getFileName(), 'run effect: '.grey + file.grey);
	
	if(client.effect){
		log.debug(log.getLineNumber(), log.getFileName(), 'stop last effect first'.grey);
		client.effect.kill('SIGINT');
		client.effect = null;
	}
	client.effect = require('child_process').fork(path + '/' + file + '.js');
	client.effect.on("message", function(){
		console.log('message'.red.bold);
	});
	client.effect.on("exit", function(){
		log.debug(log.getLineNumber(), log.getFileName(), 'exit effect'.grey);
	});
	
	callback(false);
};

function stop(client ,callback){
	log.debug(log.getLineNumber(), log.getFileName(), 'stop effect'.grey);
	client.effect.kill('SIGINT');
	
	callback(false)
}

module.exports = {
	run: run,	
	stop: stop,
	load: load
}