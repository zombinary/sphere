sphere V0.1.0
============ 
  nodejs based application to control your lights at home.
	
  **Sphere** is developed for the aurora server on atmel MCU's.
  The aplication sphere.js runs with nodejs and use the aurora API to
  controll pixel on ws2812 stripes.
  
  
tcp server for atmega328
---------------------

 * [aurora](https://github.com/zombinary/aurora)

getting started
---------------------

	* $ git clone https://github.com/zombinary/sphere
	* $ cd sphere
	* $ npm install
	* $ node sphere.js

autostart
---------------------
copy this file in autostart directory from pi

file '~/.config/autostart/sphere.desktop' ($ chmod a+x ~/.config/autostart/sphere.desktop):
```
  [Desktop Entry]
  Name=Autostart-Script
  Comment=start sphere nodejs server for light controlling over tcp
  Type=Application
  Exec=/home/pi/sphere/run
  Terminal=true
```

file '~/pi/sphere/run' ($ chmod a+x ~/pi/sphere/run):
```  
 CURRENT=/home/pi/sphere/
 cd "$CURRENT"

 node $CURRENT/sphere.js
``` 