export default async function handler(req, res) {
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
  
  // The API accepts "me" as a valid user ID that auto-resolves to the authenticated user
  const threadsUserId = userId;
  
  try {
    // Fetch user's threads posts with media and metrics
    const threadsResponse = await fetch(
      `https://graph.threads.net/v1.0/${threadsUserId}/threads?fields=id,text,permalink,timestamp,media_type,media_url,owner,is_quote_post,alt_text,children&limit=6&access_token=${accessToken}`
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
    
    // Set cache headers to reduce API calls
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
}