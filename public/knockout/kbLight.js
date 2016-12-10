var ipList = [];
/*
function drawRow(rowData, scope) {
    var row = $("<tr />")
    $("#devices_table").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it

	row.append($("<th scope=\"row\">"+ scope +"</th>"))
    row.append($("<td>" + rowData.ip + "</td>"));
    row.append($("<td>" + rowData.name + "</td>"));
    row.append($("<td>" + rowData.description + "</td>"));
}

function drawTable(data) {
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i],i);
    }
}
*/
function drawOption(optData, scope) {
	  var option = $("<option />");
	  $("#device_selectBox").append(option);
	  
	  option.append($("<option>"+ optData.name +"</option>"))
}

function drawData(data) {
    for (var i = 0; i < data.length; i++) {
        drawOption(data[i],i);
    }
}



var ViewModel = function(ip) {
    
	/* read json */
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
