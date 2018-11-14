
function drawData(files){
	var group = $("<optgroup>");
//	var end = false;
	
	//group = $("<optgroup label=\""+ files[i]+"\" style=\"text-align: right;\"/>");
	/* location */
	for (var i=0; i < files.length; i++) {
		group.append($("<option value=\""+ files[i] +"\">"+ files[i] +"</option>"));
	}
	//group.append($("</optgroup>"));
	group.append($("</optgroup>"));
	$("#device_selectBox_effects").append(group);
	return;
}

var EffectModel = function(ip) {
	//var presets = ['file1','file2','file3'];
	//drawData(presets);
    $.ajax({
        url: '/effects/',
        type: 'POST',
        data: '',
        contentType: 'application/json',
        success: function (msg){
                drawData(msg);
        },error: function (xhr, status, error) {
                console.log('Error: ' + error);
        },
    	});
    return;
};
ko.applyBindings(new EffectModel("127.0.0.1")); // This makes Knockout get to work
