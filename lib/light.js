		
function send2tcp(rgb_value) {
	var obj = {};
	obj.myData = rgb_value.toString();
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
	