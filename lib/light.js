		
function send2tcp(ip) {
	var obj = {};
        //obj.myData = rgb_value.toString();
        obj.ip = ip || 0;

        $.ajax({
                url: '/tcpSend/',
                type: 'POST',
                data: JSON.stringify(obj),
                contentType: 'application/json',
                success: function (msg){
                        console.log('success: ' , msg.toString());
                },error: function (xhr, status, error) {
                        console.log('Error: ' + error);
                },
        });
}

function setbrightness(brightness,ip) {
	var obj = {};
		//obj.brightness = brightness.toString() || 0;
		obj.brightness = brightness || 0;
		obj.ip = ip || 0;

        $.ajax({
                url: '/setbrightness/',
                type: 'POST',
                data: JSON.stringify(obj),
                contentType: 'application/json',
                success: function (msg){
                        console.log('success: ' , msg.toString());
                },error: function (xhr, status, error) {
                        console.log('Error: ' + error);
                },
        });
}

function setcolour(rgb_value,ip) {
	var obj = {};
	    //obj.color = rgb_value.toString() || 0;
		obj.color = rgb_value || 0;
        obj.ip = ip || 0;

        $.ajax({
                url: '/setcolor/',
                type: 'POST',
                data: JSON.stringify(obj),
                contentType: 'application/json',
                success: function (msg){
                        console.log('success: ' , msg.toString());
                },error: function (xhr, status, error) {
                        console.log('Error: ' + error);
                },
        });
}

	