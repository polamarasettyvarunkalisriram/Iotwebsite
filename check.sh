#!/bin/bash
echo "dev: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/)"
echo "preview: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:4173/)"
