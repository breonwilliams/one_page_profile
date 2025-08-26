async function loadThreads() {
  const container = document.querySelector('.resources-grid');
  
  if (!container) return;
  
  container.innerHTML = '<div class="loading-threads">Loading threads...</div>';
  
  try {
    const response = await fetch('/api/threads');
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    container.innerHTML = '';
    
    if (!data.data || data.data.length === 0) {
      container.innerHTML = '<div class="no-threads">No threads available</div>';
      return;
    }
    
    data.data.forEach(thread => {
      const card = createThreadCard(thread, data.user);
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading threads:', error);
    container.innerHTML = `
      <div class="thread-error">
        <p>Unable to load threads</p>
        <small>${error.message}</small>
      </div>
    `;
  }
}

function createThreadCard(thread, user) {
  const card = document.createElement('div');
  card.className = 'resource-card thread-card';
  
  const threadUrl = thread.permalink || `https://www.threads.net/@${user.username}/post/${thread.id}`;
  
  // Format the thread text with line breaks preserved
  const formattedText = formatThreadText(thread.text || '');
  
  // Create media element if present
  let mediaElement = '';
  if (thread.media_url && thread.media_type) {
    if (thread.media_type === 'IMAGE') {
      mediaElement = `
        <div class="thread-media">
          <img src="${thread.media_url}" alt="${thread.alt_text || 'Thread image'}" loading="lazy">
        </div>
      `;
    } else if (thread.media_type === 'VIDEO') {
      mediaElement = `
        <div class="thread-media">
          <video controls>
            <source src="${thread.media_url}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    }
  }
  
  // Format metrics
  const metrics = thread.metrics || {};
  
  card.innerHTML = `
    <div class="thread-header">
      <div class="thread-author">
        <span class="thread-name">Breon Williams</span>
        <span class="thread-username">@${user.username}</span>
      </div>
      <span class="thread-date">${formatDate(thread.timestamp)}</span>
    </div>
    <div class="thread-content">
      <p class="thread-text">${formattedText}</p>
      ${mediaElement}
    </div>
    <div class="thread-metrics">
      ${metrics.views ? `
        <span class="thread-metric">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          ${formatNumber(metrics.views)}
        </span>
      ` : ''}
      ${metrics.likes !== undefined ? `
        <span class="thread-metric">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          ${formatNumber(metrics.likes)}
        </span>
      ` : ''}
      ${metrics.replies !== undefined ? `
        <span class="thread-metric">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          ${formatNumber(metrics.replies)}
        </span>
      ` : ''}
      ${metrics.reposts !== undefined ? `
        <span class="thread-metric">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 1l4 4-4 4"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <path d="M7 23l-4-4 4-4"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
          ${formatNumber(metrics.reposts)}
        </span>
      ` : ''}
      <a href="${threadUrl}" target="_blank" rel="noopener noreferrer" class="thread-link" aria-label="View on Threads">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </div>
  `;
  
  return card;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

function formatThreadText(text) {
  // Preserve line breaks
  let formatted = text.replace(/\n/g, '<br>');
  
  // Make hashtags clickable
  formatted = formatted.replace(/(^|\s)#(\w+)/g, '$1<span class="thread-hashtag">#$2</span>');
  
  // Make mentions clickable
  formatted = formatted.replace(/(^|\s)@(\w+)/g, '$1<span class="thread-mention">@$2</span>');
  
  // Make URLs clickable
  formatted = formatted.replace(
    /(https?:\/\/[^\s<]+)/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="thread-link-inline">$1</a>'
  );
  
  return formatted;
}

document.addEventListener('DOMContentLoaded', () => {
  const resourcesSection = document.querySelector('.resources-section');
  if (resourcesSection) {
    // Update the section title
    const sectionTitle = resourcesSection.querySelector('.section-title');
    if (sectionTitle) {
      sectionTitle.textContent = 'Latest Threads';
    }
    
    // Load threads
    loadThreads();
  }
});