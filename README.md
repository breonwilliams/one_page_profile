# Breon Williams - Profile Page

A clean, modern single-page profile for showcasing SaaS products and developer skills.

## Project Structure

```
one_page_profile/
├── index.html              # Main HTML file
├── assets/                 # Static assets
│   ├── css/               
│   │   └── styles.css     # Main stylesheet
│   ├── js/                
│   │   └── main.js        # JavaScript functionality
│   ├── images/            # General images
│   └── fonts/             # Custom fonts (if needed)
├── images/                # Content images
│   ├── profile/           # Profile photos (headshot.jpeg)
│   ├── products/          # Product icons (style_inspector_pro.svg, founderframer.svg)
│   └── resources/         # Resource thumbnails
└── README.md              # This file
```

## Current Implementation

### Profile Section
- **Name**: Breon Williams
- **Bio**: 15+ years experience, focused on SaaS and developer tools
- **Profile Image**: Circular headshot from `images/profile/headshot.jpeg`
- **Contact Buttons**: Email (contact@breonwilliams.com), YouTube, X (Twitter), Threads
- **Skills**: 30+ technologies organized by category (Languages, Frameworks, CMS, Cloud, DevOps, AI, Product/Design)

### Products
1. **Style Inspector Pro** (styleinspectorpro.com)
   - Advanced CSS inspection & debugging tool
   - Icon: `images/products/style_inspector_pro.svg`

2. **FounderFramer** (founderframer.com)
   - Startup idea prototyping tool
   - Icon: `images/products/founderframer.svg`

### Design System
- **Golden Ratio Spacing**: All spacing based on φ (1.618)
- **Dark Theme**: Warm dark colors with subtle borders
- **Typography**: Fluid responsive sizing with clamp()
- **Pill-shaped Elements**: Buttons and tags with full border-radius

## Features

- **Responsive Design**: Optimized for all screen sizes
- **Golden Ratio Spacing**: Mathematical harmony in layout
- **Dark Theme**: Modern, eye-friendly design
- **Expandable Skills**: Toggle to show/hide additional skills (6 visible, 24+ hidden)
- **Product Showcase**: Two SaaS products with descriptions and links
- **Social Links**: Email, YouTube, X, Threads

## Future Feature: Twitter Feed Integration

### Overview
Replace the static "Resources & Knowledge" section with a dynamic Twitter feed displaying your latest tweets.

### Implementation Plan

#### 1. Twitter API Setup
```
Requirements:
- Twitter Developer Account (developer.twitter.com)
- Create App/Project
- Get API Credentials:
  - API Key
  - API Secret Key
  - Bearer Token
- Use Twitter API v2 (1,500 tweets/month free tier)
```

#### 2. Project Structure for Twitter Integration
```
one_page_profile/
├── .env.local              # API keys (never commit!)
├── api/
│   └── tweets.js          # Serverless function for Twitter API
├── assets/
│   └── js/
│       └── twitter.js     # Frontend tweet loader
└── server.js              # Local development server (optional)
```

#### 3. Local Development Setup

Create `.env.local`:
```env
TWITTER_BEARER_TOKEN=your_bearer_token_here
TWITTER_USERNAME=breonwilliams
```

Create `api/tweets.js` (Vercel serverless function):
```javascript
export default async function handler(req, res) {
  const token = process.env.TWITTER_BEARER_TOKEN;
  
  try {
    const response = await fetch(
      'https://api.twitter.com/2/users/by/username/breonwilliams',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const userData = await response.json();
    const userId = userData.data.id;
    
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=6&tweet.fields=created_at,public_metrics`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const tweets = await tweetsResponse.json();
    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
}
```

Create `assets/js/twitter.js`:
```javascript
async function loadTweets() {
  try {
    const response = await fetch('/api/tweets');
    const data = await response.json();
    
    const container = document.querySelector('.resources-grid');
    container.innerHTML = '';
    
    data.data.forEach(tweet => {
      const card = createTweetCard(tweet);
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading tweets:', error);
  }
}

function createTweetCard(tweet) {
  const card = document.createElement('div');
  card.className = 'resource-card tweet-card';
  
  card.innerHTML = `
    <div class="tweet-header">
      <span class="tweet-author">@breonwilliams</span>
      <span class="tweet-date">${formatDate(tweet.created_at)}</span>
    </div>
    <p class="tweet-text">${tweet.text}</p>
    <div class="tweet-metrics">
      <span>❤️ ${tweet.public_metrics.like_count}</span>
      <span>🔁 ${tweet.public_metrics.retweet_count}</span>
    </div>
  `;
  
  return card;
}
```

#### 4. Local Testing
For local development without Vercel, create a simple Express server:

```javascript
// server.js
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const app = express();
app.use(express.static('.'));

app.get('/api/tweets', async (req, res) => {
  // Same Twitter API logic as above
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

#### 5. Styling Tweet Cards
Add to `assets/css/styles.css`:
```css
.tweet-card {
  cursor: default;
}

.tweet-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.tweet-text {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.tweet-metrics {
  display: flex;
  gap: var(--space-base);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}
```

#### 6. Deployment to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Add environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

The `/api/tweets` endpoint will automatically work as a serverless function.

### Testing Workflow
1. Get Twitter API credentials
2. Create `.env.local` with Bearer Token
3. Test locally with Express server or Vercel dev
4. Style tweet cards to match current design
5. Deploy to Vercel when ready

### Benefits
- Displays live tweets on your profile
- Secure API key handling (never exposed to frontend)
- Works identically locally and on Vercel
- No separate backend needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 Breon Williams. All rights reserved.