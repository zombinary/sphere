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
var util = require('util');
var argv = require('optimist').argv;	// hash console options
var stackTrace = require('stack-trace'); // https://www.npmjs.com/package/stack-trace

/**********************************************************************************
 * methods
 **********************************************************************************/

module.exports = {
/**********************************************************************************
 * getLineNumber();
 *
 * description:
 *                      read the line number
 * parameter:				--           
 * return:              integer, line number
 * example:          
 *						   	var log = require("./debug/debuglog");
 *
 *								console.log(log.getFileName()); 
 *								console.log(log.getLineNumber());
 * 
 **********************************************************************************/
	getLineNumber: 
		function () {
		    if (stackTrace.get(this.getLineNumber)[0] !== undefined){
			return stackTrace.get(this.getLineNumber)[0].getLineNumber();
		}
    		    return 0;
		    },
/**********************************************************************************
 * getFileName();
 *
 * description:
 *                      read the file name
 * parameter:				--           
 * return:              sting, file name
 * example:          
 *						   	var log = require("./debug/debuglog");
 *
 *								console.log(log.getFileName()); 
 * 
 **********************************************************************************/  		  					
	getFileName: 
		function () {
			if (stackTrace.get(this.getFileName)[0] !== undefined){
			return path.basename(stackTrace.get(this.getFileName)[0].getFileName());
		    }
    		    return 0;
		    },
/**********************************************************************************
 * getBugOption();
 *
 * description:
 *                      read the debug option
 * parameter:				--           
 * return:              sting, debug level
 * example:          
 *						   	var log = require("./debug/debuglog");
 *								var RED = {}
 *								RED.settings = {"verbose": true};
 *
 *								if (RED.settings.verbose){
 *									log.msg('info', log.getFileName(), log.getLineNumber(), 'debug mode:\ ' + log.getBugOption().red.bold);
 *								}
**********************************************************************************/
	getBugOption:
		    function () {
			if(argv.debug){
			    if(argv.debug.length >= 1 && (argv.debug == 'fatal' || argv.debug == 'error' || argv.debug == 'warning' || argv.debug == 'info' || argv.debug == 'debug' || argv.debug == 'trace') ){ 
				return argv.debug;
			    }else{
				logMsg('unknown debug option', path.basename(stackTrace.get()[0].getFileName()), stackTrace.get()[0].getLineNumber(),'unknown debug level. Use option: \'fatal\', \'error\', \'warning\', \'info\', \'debug\', \'trace\'');
				if(argv.debug.length){
				    return argv.debug;
				}else{
				    return '-' ;								
				}
				
			    }
			}else{
			    return 'no debug option, run with --debug <level>';
			}
		    },
/**********************************************************************************
 * BugLevel(level);
 *
 * description:
 *                      selected debug option
 * parameter:				--           
 * return:              boolean
 * example:          
 *						   	var log = require("./debug/debuglog");
 *								if(this.BugLevel('info')){};	
 **********************************************************************************/
	BugLevel:
		    function (level) {
			if( argv.debug == 'fatal' && level == 'fatal'){
                	/* fatal - only those errors which make the application unusable should be recorded */
			    return true;
			}else if( argv.debug == 'error' && (level == 'fatal' || level == 'error')){
			     /* error - record errors which are deemed fatal for a particular request + fatal errors */
            	    return true;
			}else if( argv.debug == 'warning' && (level == 'fatal' || level == 'error' || level == 'warning' )){
                	/* warning - record problems which are non fatal + errors + fatal errors */
            	    return true;
			}else if( argv.debug == 'info' && (level == 'fatal' || level == 'error' || level == 'warning' || level == 'info')){
                	/* info - record information about the general running of the application + warn + error + fatal errors */
            	    return true;
			}else if( argv.debug == 'debug' && (level == 'fatal' || level == 'error' || level == 'warning' || level == 'info' || level == 'debug')){
            	    /* debug - record information which is more verbose than info + info + warn + error + fatal errors */
			    return true;						
			}else if( argv.debug == 'trace' && (level == 'fatal' || level == 'error' || level == 'warning' || level == 'info' || level == 'debug' || level == 'trace')){
            	    /* trace - record very detailed logging + debug + info + warn + error + fatal errors */
			    return true;
			}else{
			    return false;						
			} 
		    },
		    
/**********************************************************************************
  * msg(buglevel, filename, line, desc);
 *
 * description:
 *                      output debug information
 * parameter:           
 * 							buglevel:	string, debug level
 *								filename:	string, Filename 
 *								line:		integer, linenumber
 *								desc:		string, description text
 * return:              --
 * example:          
 *						   	var log = require("./debug/debuglog");
 *
 *								var RED = {}
 *								RED.settings = {"verbose": true};
 *
 *								log(RED.settings.verbose, log.getFileName() ,log.getLineNumber(), "fatal message");	
 *								log(RED.settings.verbose, log.getFileName() ,log.getLineNumber(), "error message");
 *								log(RED.settings.verbose, log.getFileName() ,log.getLineNumber(), "warning message");
 *								log(RED.settings.verbose, log.getFileName() ,log.getLineNumber(), "info message");
 *								log(RED.settings.verbose, log.getFileName() ,log.getLineNumber(), "debug  message");
 *								log(RED.settings.verbose, log.getFileName() ,log.getLineNumber(), "trace message");
 *
 **********************************************************************************/  					  					
	msg:
		function(buglevel,filename, line, desc){
			//logMsg(stackTrace.get()[0].getMethodName(), filename, line, desc);
			if(this.BugLevel(buglevel)){
			    logMsg(buglevel , filename, line, desc);
			}
		},
/**********************************************************************************
 * info(info, filename, line, desc);
 *
 * description:
 *                      output debug information
 * parameter:           
 * 							info:			string, info name
 *								filename:	string, Filename 
 *								line:			integer, linenumber
 *								desc:			string, description text
 * return:              --
 * example:          
 *						   	var log = require("./debug/debuglog");
 *								log.info('debug mode', log.getFileName(), log.getLineNumber());
 *
 **********************************************************************************/  					  					
	info:
		function(info,filename, line){
		    logMsg(info , filename, line, 'debug mode:\ ' + this.getBugOption().toString().red.bold);
		}				
};
/**********************************************************************************
 * logMsg();
 *
 * description:
 *             	create the log message	
 * parameter:        
 * 					level:			string, log level
 *						filename:		string, Filename 
 *						line:				integer, linenumber
 *						description:	string, error description
 * return:        JSON-Object, session
 * example:       --
 *
 **********************************************************************************/
function logMsg(buglevel, filename, line, desc){	
    if(desc !== undefined){
	util.log('[' + buglevel +']'+' - '+'['+filename+': '+ line +'] ' + '"' + desc.toString().grey	 + '"');
    }
}