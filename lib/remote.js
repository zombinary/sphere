function setrange_req(range, deviceId) {
  if(deviceId){
	var obj = {
              deviceId: deviceId,
              range: range || 0,
            };

        $.ajax({
                url: '/setrange_req/',
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
}

function setcolor_req(deviceId) {
 console.log(deviceId);
  if(deviceId){
    var obj = {
              deviceId: deviceId
            };

        $.ajax({
                url: '/setcolor_req/',
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
}

function setbrightness(brightness,deviceId) {
  if(deviceId){
	var obj = {
              deviceId: deviceId,
              brightness: brightness || 0
            };

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
}

function setcolor(rgb_value,deviceId) {
  if(deviceId){
	var obj = {
              deviceId: deviceId,
              color: rgb_value || 0,
            };

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
}

	