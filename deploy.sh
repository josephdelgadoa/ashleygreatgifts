#!/bin/bash

# Configuration
SERVER="srv1229016.hstgr.cloud"
USER="root"
REMOTE_DIR="/var/www/ashleygreatgifts"
REPO_URL="https://github.com/josephdelgadoa/ashleygreatgifts.git"

echo "Deploying to $SERVER..."

# 1. Create directory on server if it doesn't exist
echo "Ensuring remote directory exists..."
ssh $USER@$SERVER "mkdir -p $REMOTE_DIR"

# 2. Copy .env file (since it's not in git)
echo "Copying .env file..."
scp .env $USER@$SERVER:$REMOTE_DIR/.env

# 3. Pull latest code and run docker-compose
echo "Pulling latest code and restarting containers..."
ssh $USER@$SERVER "
    cd $REMOTE_DIR
    if [ ! -d .git ]; then
        git clone $REPO_URL .
    else
        git pull origin main
    fi
    docker-compose down
    docker-compose up -d --build
"

echo "Deployment complete! Application should be running on port 8005."
