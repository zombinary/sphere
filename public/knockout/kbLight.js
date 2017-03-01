function drawData(server){
	var group = null;
	
	/* location */
	for (var i=0; i < server.length; i++) {
		group = $("<optgroup label=\""+ server[i].location+"\"/>");
		$("#device_selectBox").append(group);
		for (var j=0; j< server[i].device.length; j++) {  
			//group.append($("<option>"+ server[i].device[j].name +"</option>"));
			group.append($("<option value=\""+ server[i].device[j].ip +"\">"+ server[i].device[j].name +"</option>"));
		}
		group.append($("</optgroup>"))
	}
}

var ViewModel = function(ip) {
    
	$.getJSON("/settings/config", function(data) { 
		var config = data;
    
		if(config.light.server){
			drawData(config.light.server);    		
		}else{
			alert('invalid config - config.json');
		}  
	});
	//return this.config;
	return;
};
ko.applyBindings(new ViewModel("127.0.0.1")); // This makes Knockout get to work

