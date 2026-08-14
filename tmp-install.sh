#!/bin/bash
export PATH="/home/hp/.nvm/versions/node/v22.23.1/bin:$PATH"
cd /home/hp/iot
npm install three@^0.160.0 @react-three/fiber@^8.17.10 @react-three/drei@^9.114.0 framer-motion@^11.11.17 2>&1 | tail -20
