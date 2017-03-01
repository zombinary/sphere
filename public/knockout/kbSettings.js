var ipList = [];

function drawRow(device, scope, subScope) {
	var row = $("<tr />")
    $("#devices_table").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it

	row.append($("<th scope=\"row\">"+ scope+'.'+ subScope +"</th>"));

	/* device */
	row.append($("<td></td>"));
	row.append($("<td>" + device.ip + "</td>"));
	row.append($("<td>" + device.name + "</td>"));
	row.append($("<td>" + device.description + "</td>"));
}

function drawLocation(location, scope) {
	var row = $("<tr />")
    $("#devices_table").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it

	row.append($("<th scope=\"row\">"+ scope +"</th>"));
	row.append($("<td>" + location.location + "</td>"));

	/* device */
	row.append($("<td>" + location.device[0].ip + "</td>"));
	row.append($("<td>" + location.device[0].name + "</td>"));
	row.append($("<td>" + location.device[0].description + "</td>"));
}


function drawTable(server){
	/* location */
	for (var i=0; i < server.length; i++) {
		drawLocation(server[i],i);
		for (var j=1; j< server[i].device.length; j++) {  
			drawRow(server[i].device[j],i,j);
		}
	}
}

var ViewModel = function(ip) {
    
	/* read json */
	$.getJSON("/settings/config", function(data) { 
		var config = data;
    
		if(config.light.server){
			drawTable(config.light.server);    		
		}else{
			alert('invalid config - config.json');
		}  
	});
	//return this.config;
	return;
};

ko.applyBindings(new ViewModel("127.0.0.1")); // This makes Knockout get to work

