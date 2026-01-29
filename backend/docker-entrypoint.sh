#!/bin/bash
set -e

# Install Composer dependencies if vendor directory doesn't exist
if [ ! -d "/var/www/html/vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install --no-interaction --optimize-autoloader
fi

# Create uploads directory with proper permissions
mkdir -p /var/www/html/web/uploads
chown www-data:www-data /var/www/html/web/uploads
chmod 755 /var/www/html/web/uploads

# Execute the main container command
exec apache2-foreground
