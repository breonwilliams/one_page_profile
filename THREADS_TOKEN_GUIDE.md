# Threads API Token Management Guide

## Current Status
- **Token Type**: Short-lived (expires in ~1 hour)
- **Token Added**: Successfully configured in `.env.local`
- **User ID**: Still needed (get from Graph API Explorer with `/me` endpoint)

## Getting Your Threads User ID

1. Go to Graph API Explorer
2. Make sure your token is selected
3. Change endpoint to: `/me`
4. Click Submit
5. Copy the "id" value from the response
6. Update `THREADS_USER_ID` in `.env.local`

## Converting to Long-Lived Token (Required for Production)

### Method 1: Using cURL
```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=24286019167706703&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_CURRENT_TOKEN"
```

### Method 2: Graph API Explorer
1. In Graph API Explorer, change endpoint to: `/access_token`
2. Change method to POST
3. Add parameters:
   - `grant_type`: `fb_exchange_token`
   - `client_id`: `24286019167706703`
   - `client_secret`: [Your app secret from dashboard]
   - `fb_exchange_token`: [Your current token]
4. Click Submit

### Long-Lived Token Details
- **Duration**: 60 days
- **Refresh**: Can refresh after 24 hours but before expiry
- **Usage**: Use this for production deployment

## Token Refresh (Before Expiry)

To refresh a long-lived token before it expires:
```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=24286019167706703&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_LONG_LIVED_TOKEN"
```

## Deployment to Vercel

1. **Never commit tokens to Git** (already in .gitignore)

2. **Add to Vercel Environment Variables**:
   ```
   THREADS_ACCESS_TOKEN = [your long-lived token]
   THREADS_USER_ID = [your threads user id]
   THREADS_USERNAME = breonwilliams
   ```

3. **Deploy**:
   ```bash
   npx vercel --prod
   ```

## Security Best Practices

1. ✅ `.env.local` is in `.gitignore`
2. ✅ Never share tokens publicly
3. ✅ Use long-lived tokens for production
4. ✅ Implement token refresh logic for production apps
5. ✅ Store tokens in environment variables on hosting platforms

## Testing Your Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run locally**:
   ```bash
   npm start
   ```

3. **Visit**: http://localhost:3000
   - Your Threads posts should appear in "Latest Threads" section

## Troubleshooting

- **"User ID not configured"**: Get your User ID from Graph API Explorer `/me` endpoint
- **"Invalid token"**: Token may have expired, generate a new one
- **No posts showing**: Check if you have public posts on Threads
- **API errors**: Verify all permissions are granted (threads_basic, etc.)

## Token Expiration Schedule

- **Short-lived token**: ~1 hour (current)
- **Long-lived token**: 60 days
- **Refresh window**: After 24 hours, before 60 days

Set a reminder to refresh your token before the 60-day expiry!