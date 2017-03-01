		
function send2tcp(rgb_value, ip) {
	var obj = {};
			obj.myData = rgb_value.toString();
			//obj.ip = '10.11.0.101';
			obj.ip = ip;
	
	$.ajax({
		url: '/tcpSend/',
		type: 'POST',
		data: JSON.stringify(obj),
		contentType: 'application/json',
		success: function (msg){
			console.log('success: '	, msg.toString());
		},error: function (xhr, status, error) {
			console.log('Error: ' + error);
		},
	});
}
	