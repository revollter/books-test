#!/bin/sh
set -e

# Copy node_modules from build if volume is empty
if [ ! -d "/usr/share/nginx/html/node_modules/angular" ]; then
    echo "Copying node_modules from build..."
    cp -r /tmp/node_modules/* /usr/share/nginx/html/node_modules/
fi

exec nginx -g 'daemon off;'
