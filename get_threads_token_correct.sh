#!/bin/bash

# Script to exchange short-lived Threads token for long-lived token
# Using the correct Threads App ID: 24286019167706703

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Error: Please provide both the Threads app secret and short-lived token"
    echo "Usage: ./get_threads_token_correct.sh THREADS_APP_SECRET SHORT_TOKEN"
    echo ""
    echo "To get your Threads app secret:"
    echo "1. Go to https://developers.facebook.com/apps/24286019167706703/settings/basic/"
    echo "2. Find 'App Secret' (or 'Threads App Secret') and click 'Show'"
    echo "3. Copy the secret"
    exit 1
fi

THREADS_APP_SECRET=$1
SHORT_TOKEN=$2
THREADS_APP_ID="24286019167706703"

echo "Exchanging short-lived token for long-lived token..."
echo "Using Threads App ID: $THREADS_APP_ID"
echo ""

# Make the API call
response=$(curl -s -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$THREADS_APP_ID&client_secret=$THREADS_APP_SECRET&fb_exchange_token=$SHORT_TOKEN")

# Check if the response contains an access_token
if echo "$response" | grep -q '"access_token"'; then
    echo "✅ Success! Here's your long-lived token:"
    echo ""
    echo "$response" | python3 -m json.tool
    echo ""
    
    # Extract just the token
    token=$(echo "$response" | python3 -c "import json,sys;print(json.load(sys.stdin)['access_token'])")
    
    echo "📋 Your new long-lived Threads token (copy this):"
    echo ""
    echo "$token"
    echo ""
    echo "⏰ This token will expire in 60 days"
    echo ""
    echo "📝 Next steps:"
    echo "1. Copy the token above"
    echo "2. Update THREADS_ACCESS_TOKEN in your .env.local file"
    echo "3. Restart your development server"
else
    echo "❌ Error getting long-lived token:"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
    echo ""
    echo "Please check:"
    echo "- You're using the THREADS app secret (not the regular app secret)"
    echo "- Your short-lived token hasn't expired"
    echo "- The token has Threads permissions"
fi