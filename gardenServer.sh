#!/bin/sh
#/etc/init.d/gardenServer.sh
export PATH=$PATH:/usr/local/bin
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules

case "$1" in
start)
exec forever --sourceDir=/home/pi/Projects/GardenServer -p /home/pi/Projects/GardenServer app.js
;;
stop)
exec forever stop --sourceDir=/home/pi/Projects/GardenServer app.js
;;
*)
echo "Usage: /etc/init.d/gardenServer.sh {start|stop}"
exit 1
;;
esac
exit 0
