#!/bin/bash

# Configuration
SERVER="srv1229016.hstgr.cloud"
user="root"
REMOTE_DIR="/root/ashleygreatgifts"
REPO_URL="https://github.com/josephdelgadoa/ashleygreatgifts.git"

# Deploy to VPS
echo "Deploying to $SERVER..."

ssh $user@$SERVER << EOF
    # Create directory if it doesn't exist
    mkdir -p $REMOTE_DIR
    cd $REMOTE_DIR

    # Initialize git if needed
    if [ ! -d .git ]; then
        git clone $REPO_URL .
    else
        git pull origin main
    fi

    # Build and Start Containers
    echo "Building and restarting containers..."
    # We use 'docker compose' (v2) or fallback to docker-compose
    if command -v docker-compose &> /dev/null; then
        docker-compose down
        docker-compose up -d --build
    else
        docker compose down
        docker compose up -d --build
    fi

    # Prune unused images to save space
    docker image prune -f
EOF

echo "Deployment complete! Application should be running on port 8005."
