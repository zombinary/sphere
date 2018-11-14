/**************************************************************************************
* Copyright © 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See Hilscher_Source_Code_License.txt
***************************************************************************************
* $Id:  $:
*
* Description:
* 
* Level of logging to be recorded. Options are:
*      		fatal - only those errors which make the application unusable should be recorded
*      		error - record errors which are deemed fatal for a particular request + fatal errors
*      		warning - record problems which are non fatal + errors + fatal errors
*      		info - record information about the general running of the application + warn + error + fatal errors
*      		debug - record information which is more verbose than info + info + warn + error + fatal errors
*      		trace - record very detailed logging + debug + info + warn + error + fatal errors
* 
* Example:
*		// use debug mode in Node-red node
*		var log = require('./lib/debug/debuglog');
*		log.msg('info', log.getFileName(), log.getLineNumber(), 'myInfo Text');
*					
*		$ node-red --debug trace
*		> <date> - [info] - [<filename>: <linename>] "debug mode: trace"
*		> <date> - [info] - [<filename>: <linename>] "myText"
*
* Changes:
*  Date          Description
*  -----------------------------------------------------------------------------------
*
*  2016-03-08   add method info                 [@juli]
*  2016-03-07   create                          [hplatz]
*
**************************************************************************************/

require('colors');
var path = require('path');
var assert = require('assert');
//var argv = require('optimist').argv;	// hash console options
var stackTrace = require('stack-trace'); // https://www.npmjs.com/package/stack-trace

var settings = require('./settings.json');

var argv = process.argv;

/**********************************************************************************
 * methods
 **********************************************************************************/
var traceLevel = settings.traceLevel;
var loglevel = settings.log;

function hash(){
	
	if(!settings.enable || !argv.e || !argv.enable){
		console.log('debug output disabled');
	}	
		loglevel = 	argv.d || argv.debug || settings.log;	
		traceLevel = argv.l || argv.tracelevel || settings.traceLevel;
	
		switch(loglevel){
		case 'info':
			loglevel = 0;
			traceLevel = 0;
			break;
		case 'warning': 
			loglevel = 1;
			traceLevel = 0;
			break;
		case 'error': 		 
			loglevel = 2;
			traceLevel = 0;
			break;	
		case 'debug': 
			loglevel = 3;
			traceLevel = 0;
			break;
		case 'trace':
			loglevel = 4;
			break;	  
		default:
			break
		}
	
	
	if(argv.h || argv.help){
		console.log('Usage: node [FILE...] [OPTION...]');
		console.log('\t\t -h\t--help \t\t\t' + 'display this help this help and exit');
		console.log('\t\t -d\t--debug \t\t\t' + 'print out the logging on concole use \'0..4\' as option');
		console.log('\t\t -l\t--tracelevel\t' + 'set the trace level');
	}
}

hash();

module.exports = {	
	getLineNumber: 
		function () {
		    if (stackTrace.get(this.getLineNumber)[0] !== undefined){
			return stackTrace.get(this.getLineNumber)[0].getLineNumber();
		}
    		    return 0;
		    },
	getFileName: 
		function () {
			if (stackTrace.get(this.getFileName)[0] !== undefined){
			return path.basename(stackTrace.get(this.getFileName)[0].getFileName());
		    }
    		    return 0;
		    },
	get: 
		function () {
			if (stackTrace.get(this)[0] !== undefined){
				return stackTrace.get(this);
			 }
		     return 0;
		},	    
	info: function(filename, line, description){
		if(loglevel >= 0){
			log('info', filename, line, description);
		}
    	return;
     },
     warn: function(filename, line, description){
    	 if(loglevel >= 1){
    		 log('warning', filename, line, description);
    	 } 
    	return;},
     error: function(filename, line, description){
    	 if(loglevel >= 2){
    		 log('error', filename, line, description);
    	 }
    	 return;},
     debug: function(filename, line, description){
    	 if(loglevel >= 3){
    		 log('debug', filename, line, description);
    	 }
    	 return;},
     trace: function(trace, filename, line, description){
    	 if(loglevel >= 4){
    		 log('trace', filename, line, description || ''); 
    	 }
    	 for ( var i = 0; i < traceLevel; i++) {
    		 if(!trace[i]){continue;}
    		functionName = trace[i].getFunctionName() || '-';
    		methodName = trace[i].getMethodName() || '-';
    		fileName = path.basename(trace[i].getFileName()) || '-';
			lineNumber = trace[i].getLineNumber().toString() || '-';
			columnNumber = trace[i].getColumnNumber().toString()|| '-';
			console.log( '\t\t' + '[ '.cyan.bold + i.toString().grey + ' ] '.cyan.bold + functionName.grey + '/'.grey + methodName.grey + ' : '.grey + fileName.grey+ '['.grey + lineNumber.grey + ':'.grey+ columnNumber.grey + ']'.grey);
    	 }
	 return;}, 
};

function log(level, filename, line, description){	
	if(settings.enable || argv.e || argv.enable){
		assert.equal(description === null, false, 'undefined description');
		assert.equal(typeof description === 'string', true, 'description is not type of string');
		var d = new Date();
		if(description !== undefined && typeof description === 'string'){
			console.log( d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds() + ' - ' + '[' + level +']'+' - '+'['+filename+': '+ line +'] ' + '"' + description.toString().grey	 + '"');
		}
	}
}