#!/bin/bash
export PATH="/home/hp/.nvm/versions/node/v22.23.1/bin:$PATH"
cd /home/hp/iot
nohup npm run preview > /tmp/preview.log 2>&1 &
tail -f /tmp/preview.log
