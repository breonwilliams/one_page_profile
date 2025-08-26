# Threads API Setup Instructions

## ⚠️ SECURITY FIRST
**NEVER share your App Secret publicly!** If you've shared it anywhere (including in messages), reset it immediately in your Meta Developer Dashboard.

## Getting Your Threads Credentials

### What You Need:
1. **Access Token** - For authenticating API requests
2. **Threads User ID** - Your specific Threads account ID

### Step 1: Generate Access Token
Since you have your App ID (24286019167706703), you need to generate an Access Token:

1. Go to Meta Developer Dashboard
2. Navigate to your app (ID: 24286019167706703)
3. Go to "Threads" → "API Setup"
4. Click on "Generate Token" or "User Token Generator"
5. Grant the following permissions:
   - `threads_basic`
   - `threads_content_publish` (if you want to post)
   - `threads_read_replies`
   - `threads_manage_insights`
6. Copy the generated Access Token

### Step 2: Get Your Threads User ID
Your Threads User ID is different from your App ID. To find it:

#### Option A: Using Graph API Explorer
1. Go to https://developers.facebook.com/tools/explorer/
2. Select your app from the dropdown
3. Paste your Access Token
4. Make a GET request to: `/me`
5. Your User ID will be in the response

#### Option B: Using cURL
```bash
curl -X GET "https://graph.threads.net/v1.0/me?access_token=YOUR_ACCESS_TOKEN"
```

### Step 3: Update .env.local
```env
# Threads API Configuration
THREADS_ACCESS_TOKEN=YOUR_LONG_ACCESS_TOKEN_HERE
THREADS_USER_ID=YOUR_THREADS_USER_ID_HERE
THREADS_USERNAME=breonwilliams
```

## Important Notes:
- **App ID** (24286019167706703) = Your application's ID
- **App Secret** = KEEP SECRET! Never put in client-side code
- **Access Token** = What you use to make API calls
- **User ID** = Your specific Threads account identifier

## Testing Your Setup:
1. Install dependencies: `npm install`
2. Update `.env.local` with your Access Token and User ID
3. Run: `npm start`
4. Visit: http://localhost:3000

## Security Best Practices:
1. **Never commit .env.local to git**
2. **Never share your App Secret**
3. **Regenerate tokens if exposed**
4. **Use environment variables in production (Vercel)**