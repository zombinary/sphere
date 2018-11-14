function drawData(obj){
	var group = null;

	/* location */
	for (var i=0; i < obj.locations.length; i++) {
		var loc = obj.locations[i];
		group = $("<optgroup label=\""+ loc.name+"\" style=\"text-align: right;\"/>");
    $("#device_selectBox").append(group);
		for (var j=0; j< obj.devices.length; j++) {
			var dev = obj.devices[j];
      if(dev.location === loc._z){
        //group.append($("<option>"+ server[i].device[j].name +"</option>"));
        group.append($("<option value=\""+ dev.id +"\">"+ dev.name +"</option>"));
      }
		}
		group.append($("</optgroup>"))
	}
  return;
}

var ViewModel = function(ip) {
	$.getJSON("/settings/config", function(data) { 
		var config = data;
		if(config.light){
			drawData(config.light);
		}else{
      alert('invalid config - config.json');
		}  
	});
	return;
};
ko.applyBindings(new ViewModel("127.0.0.1")); // This makes Knockout get to work