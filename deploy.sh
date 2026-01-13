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
    # Initialize git if not present (handles non-empty directory case)
    if [ ! -d .git ]; then
        git init
        git remote add origin $REPO_URL
        git fetch origin
        git checkout -t origin/main -f
    else
        git pull origin main
    fi
    
    # Try 'docker compose' first, fallback to 'docker-compose'
    if command -v docker-compose &> /dev/null; then
        docker-compose down
        docker-compose up -d --build
    else
        docker compose down
        docker compose up -d --build
    fi
"

echo "Deployment complete! Application should be running on port 8005."
