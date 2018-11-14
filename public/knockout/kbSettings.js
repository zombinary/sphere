var ipList = [];

function drawRow(device, scope, subScope) {
	var row = $("<tr />")
    $("#devices_table").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it

	row.append($("<th scope=\"row\">"+ scope+'.'+ subScope +"</th>"));

	/* device */
	row.append($("<td></td>"));
	row.append($("<td>" + device.ip + "</td>"));
	row.append($("<td>" + device.port + "</td>"));
	row.append($("<td>" + device.name + "</td>"));
	row.append($("<td>" + device.description + "</td>"));
}

function drawLocation(obj, scope) {
	var row = $("<tr />")
    $("#devices_table").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it

	row.append($("<th scope=\"row\">"+ scope +"</th>"));
	row.append($("<td>" + obj.location + "</td>"));

	/* device */
	row.append($("<td>" + obj.devices[0].ip + "</td>"));
	row.append($("<td>" + obj.devices[0].port + "</td>"));	
	row.append($("<td>" + obj.devices[0].name + "</td>"));
	row.append($("<td>" + obj.devices[0].description + "</td>"));
}


function drawTable(area){
	/* location */
	for (var i=0; i < area.length; i++) {
		var a = area[i];
		drawLocation(a,i);
		for (var j=1; j< a.devices.length; j++) {
			var dev = a.devices[j];
			drawRow(dev,i,j);
		}
	}
}

var ViewModel = function(ip) {
    
	/* read json */
	$.getJSON("/settings/config", function(json) {
		var config = json;
		if(config.light.area){
			drawTable(config.light.area);    		
		}else{
			alert('invalid config - config.json');
		}  
	});
	//return this.config;
	return;
};

ko.applyBindings(new ViewModel("127.0.0.1")); // This makes Knockout get to work

