#!/bin/bash
export PATH="/home/hp/.nvm/versions/node/v22.23.1/bin:$PATH"
cd /home/hp/iot
pkill -f "vite" 2>/dev/null
sleep 1
nohup npm run dev > /tmp/arduino-dev.log 2>&1 &
echo "started pid $!"
