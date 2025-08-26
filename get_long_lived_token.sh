#!/bin/bash

# Script to exchange short-lived Threads token for long-lived token
# Usage: ./get_long_lived_token.sh YOUR_APP_SECRET

if [ -z "$1" ]; then
    echo "Error: Please provide your app secret as an argument"
    echo "Usage: ./get_long_lived_token.sh YOUR_APP_SECRET"
    echo ""
    echo "To get your app secret:"
    echo "1. Go to https://developers.facebook.com/apps/1441412417076578/settings/basic/"
    echo "2. Find 'App Secret' and click 'Show'"
    echo "3. Copy the secret and run this script again"
    exit 1
fi

APP_SECRET=$1
SHORT_TOKEN="EAAUe9PsYPWIBPe7Jlitfn7AeHUlcXk3ZBZCFURrZBTSTUJFTgKzPf1FxEdzvnEobRJ5qgcukPfTCNaVh4eiyUzLAsHKjiGdO4GH3l56qZCau84i5xR3CFVLoYE4ysDM2njcL2OgXZCAZBHGTYOXCdYtPYnMXzmdMZCVJt2LDYmQoZBdvD3qglNOW21qccUwR5Wgk1ZAkt2Dz9IayZBZBguSUs8VQUPuejYRZAjcNXIP0EEewhqOM"
APP_ID="1441412417076578"

echo "Exchanging short-lived token for long-lived token..."
echo ""

# Make the API call
response=$(curl -s -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$APP_ID&client_secret=$APP_SECRET&fb_exchange_token=$SHORT_TOKEN")

# Check if the response contains an access_token
if echo "$response" | grep -q '"access_token"'; then
    echo "✅ Success! Here's your long-lived token:"
    echo ""
    echo "$response" | python3 -m json.tool
    echo ""
    
    # Extract just the token
    token=$(echo "$response" | python3 -c "import json,sys;print(json.load(sys.stdin)['access_token'])")
    
    echo "📋 Your new long-lived token (copy this):"
    echo ""
    echo "$token"
    echo ""
    echo "⏰ This token will expire in 60 days"
    echo ""
    echo "📝 Next steps:"
    echo "1. Copy the token above"
    echo "2. Update THREADS_ACCESS_TOKEN in your .env.local file"
    echo "3. Update the comment to reflect the new expiration date (60 days from now)"
    echo "4. Restart your development server"
else
    echo "❌ Error getting long-lived token:"
    echo "$response"
    echo ""
    echo "Please check:"
    echo "- Your app secret is correct"
    echo "- Your short-lived token hasn't expired yet"
fi