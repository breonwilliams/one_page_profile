# Breon Williams - Profile Page

A modern single-page portfolio showcasing SaaS products, developer skills, and live Threads feed integration.

![Profile](https://img.shields.io/badge/Profile-Live-green)
![Threads API](https://img.shields.io/badge/Threads%20API-Integrated-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Features

- **Dynamic Threads Feed**: Live integration with Meta's Threads API displaying latest posts
- **Product Showcase**: Highlighting SaaS products with descriptions and links
- **Expandable Skills Section**: 30+ technologies with toggle visibility
- **Responsive Design**: Optimized for all screen sizes
- **Golden Ratio Design System**: Mathematical harmony using φ (1.618)
- **Dark Theme**: Modern, eye-friendly design with warm tones
- **Social Links**: Direct connections to Email, YouTube, X (Twitter), and Threads

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **API Integration**: Threads API v1.0
- **Backend**: Node.js + Express (development server)
- **Deployment**: Vercel (serverless functions)
- **Design**: CSS Custom Properties, Golden Ratio spacing

## 📁 Project Structure

```
one_page_profile/
├── api/
│   └── threads.js          # Serverless function for Threads API
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet with dark theme
│   └── js/
│       ├── main.js         # Core JavaScript functionality
│       └── threads.js      # Threads feed loader
├── images/
│   ├── profile/
│   │   └── headshot.jpeg   # Profile photo
│   └── products/
│       ├── style_inspector_pro.svg
│       └── founderframer.svg
├── .env.local              # Environment variables (git-ignored)
├── .gitignore              # Git ignore configuration
├── index.html              # Main HTML file
├── package.json            # Node.js dependencies
├── server.js               # Development server
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

## ⚡ Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Meta Developer Account
- Threads account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/breonwilliams/one_page_profile.git
cd one_page_profile
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
THREADS_ACCESS_TOKEN=your_threads_access_token
THREADS_USER_ID=your_threads_user_id
THREADS_USERNAME=your_threads_username
```

4. **Start development server**
```bash
npm start
```

5. **View your site**
Open http://localhost:3000 in your browser

## 🔑 Threads API Setup

### Getting Your Credentials

1. **Create Meta Developer Account**
   - Visit [developers.facebook.com](https://developers.facebook.com)
   - Create a new app with "Business" type

2. **Add Threads API**
   - In app dashboard, click "Add Product"
   - Select "Threads" and configure permissions:
     - `threads_basic`
     - `threads_content_publish`
     - `threads_manage_insights`
     - `threads_read_replies`

3. **Generate Access Token**
   - Use Graph API Explorer
   - Select your app and Threads permissions
   - Generate token (valid for 1 year)

4. **Get User ID**
   - Make a request to `https://graph.threads.net/v1.0/me`
   - Copy the returned `id` value

### API Endpoints

The integration uses these Threads API endpoints:

- **Get user posts**: `/v1.0/{user-id}/threads`
- **Get post metrics**: `/v1.0/{post-id}/insights`
- **User info**: `/v1.0/me`

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set environment variables in Vercel dashboard**
   - Add `THREADS_ACCESS_TOKEN`
   - Add `THREADS_USER_ID`
   - Add `THREADS_USERNAME`

4. **Deploy to production**
```bash
vercel --prod
```

## 🎨 Design System

### Color Palette

- **Backgrounds**: Warm dark tones (#0F0F0E to #262624)
- **Text**: Cream to muted browns (#FAF9F5 to #6B6A63)
- **Accents**: Purple (#6C5BB9) and Orange (#D97757)

### Spacing System

All spacing based on Golden Ratio (φ = 1.618):
- `--space-xs`: 0.236rem
- `--space-sm`: 0.382rem
- `--space-md`: 0.618rem
- `--space-base`: 1rem
- `--space-lg`: 1.618rem
- `--space-xl`: 2.618rem

### Typography

Fluid responsive sizing using `clamp()`:
- Base: `clamp(1rem, 0.9rem + 0.5vw, 1.125rem)`
- Scales from mobile to desktop seamlessly

## 📝 Configuration

### Customization

1. **Profile Information**
   - Edit `index.html` to update bio, name, and social links

2. **Products**
   - Modify product cards in `index.html`
   - Replace SVG icons in `images/products/`

3. **Skills**
   - Add/remove skills in the HTML skills section
   - First 6 are visible, rest are hidden behind toggle

4. **Styling**
   - All colors defined as CSS variables in `styles.css`
   - Easy to create light theme by adding alternate color definitions

## 🔧 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# View at http://localhost:3000
```

### Project Scripts

- `npm start` - Start development server
- `npm run dev` - Alias for start

## 📚 API Documentation

### Threads Feed Response Structure

```json
{
  "data": [
    {
      "id": "thread_id",
      "text": "Thread content",
      "timestamp": "2025-08-26T00:00:00+0000",
      "media_type": "TEXT_POST",
      "media_url": "url_if_media",
      "permalink": "https://threads.net/...",
      "metrics": {
        "views": 100,
        "likes": 10,
        "replies": 5,
        "reposts": 2
      }
    }
  ]
}
```

## 🛡️ Security

- Access tokens stored in `.env.local` (never committed)
- Serverless functions hide API credentials
- `.gitignore` configured to exclude sensitive files
- Token has 1-year validity (long-lived)

## 🐛 Troubleshooting

### Common Issues

1. **No threads displaying**
   - Verify access token is valid
   - Check User ID is correct
   - Ensure you have public posts on Threads

2. **API errors**
   - Token may have expired
   - Check all permissions are granted
   - Verify Meta app is properly configured

3. **Build errors**
   - Run `npm install` to ensure dependencies
   - Check Node.js version (v14+)

## 📄 License

© 2024 Breon Williams. All rights reserved.

---

Built with ❤️ using Threads API | [Live Demo](https://breonwilliams.com)