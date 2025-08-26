const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// API endpoint for threads
app.get('/api/threads', async (req, res) => {
  const accessToken = process.env.THREADS_ACCESS_TOKEN;
  const userId = process.env.THREADS_USER_ID;
  
  if (!accessToken || accessToken === 'your_access_token_here') {
    return res.status(500).json({ 
      error: 'Threads Access Token not configured. Please add your token to .env.local' 
    });
  }
  
  if (!userId || userId === 'your_user_id_here') {
    return res.status(500).json({ 
      error: 'Threads User ID not configured. Please add your user ID to .env.local' 
    });
  }
  
  try {
    // Fetch user's threads posts
    const threadsResponse = await fetch(
      `https://graph.threads.net/v1.0/${userId}/threads?fields=id,text,permalink,timestamp,media_type,media_url,owner,is_quote_post,alt_text,children&limit=6&access_token=${accessToken}`
    );
    
    if (!threadsResponse.ok) {
      const errorData = await threadsResponse.json();
      throw new Error(`Failed to fetch threads: ${errorData.error?.message || threadsResponse.statusText}`);
    }
    
    const threadsData = await threadsResponse.json();
    
    // Fetch metrics for each thread post
    const postsWithMetrics = await Promise.all(
      threadsData.data.map(async (post) => {
        try {
          const metricsResponse = await fetch(
            `https://graph.threads.net/v1.0/${post.id}/insights?metric=views,likes,replies,reposts,quotes&access_token=${accessToken}`
          );
          
          if (metricsResponse.ok) {
            const metricsData = await metricsResponse.json();
            const metrics = {};
            
            metricsData.data.forEach(metric => {
              metrics[metric.name] = metric.values[0]?.value || 0;
            });
            
            return { ...post, metrics };
          }
        } catch (error) {
          console.error(`Failed to fetch metrics for post ${post.id}:`, error);
        }
        
        return post;
      })
    );
    
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ 
      data: postsWithMetrics,
      user: {
        id: userId,
        username: process.env.THREADS_USERNAME || 'breonwilliams'
      }
    });
  } catch (error) {
    console.error('Threads API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch threads' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\n========================================');
  console.log('THREADS FEED SETUP INSTRUCTIONS:');
  console.log('========================================\n');
  console.log('1. Create a Meta Developer Account:');
  console.log('   - Go to https://developers.facebook.com');
  console.log('   - Sign in with your Facebook account\n');
  console.log('2. Create a New App:');
  console.log('   - Click "My Apps" → "Create App"');
  console.log('   - Choose "Business" type');
  console.log('   - Give it a name (e.g., "My Portfolio Site")\n');
  console.log('3. Add Threads to Your App:');
  console.log('   - In your app dashboard, click "Add Product"');
  console.log('   - Find "Threads" and click "Set Up"');
  console.log('   - Grant the required permissions\n');
  console.log('4. Get Your Credentials:');
  console.log('   - Go to "Threads" → "API Setup"');
  console.log('   - Copy your Access Token');
  console.log('   - Copy your User ID\n');
  console.log('5. Update .env.local:');
  console.log('   - Replace "your_access_token_here" with your Access Token');
  console.log('   - Replace "your_user_id_here" with your User ID\n');
  console.log('6. Refresh this page to see your Threads!\n');
  console.log('========================================\n');
});