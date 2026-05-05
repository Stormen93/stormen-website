document.addEventListener('DOMContentLoaded', () => {
  if (window.feather && typeof feather.replace === 'function') {
    try {
      feather.replace();
    } catch {}
  }

  const siteHeader = document.getElementById('siteHeader');
  if (!siteHeader) return;
  const menuToggle = siteHeader.querySelector('.mobile-menu-toggle');

  const onScroll = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 10);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteHeader.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    siteHeader.querySelectorAll('.desktop-nav a, .header-cta').forEach((link) => {
      link.addEventListener('click', () => {
        siteHeader.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  initTwitchEmbeds();
  initYouTubeVideos();
  initRollingScheduleDates();
  initProductImageSwaps();
  initContactForm();
});

const stormenConfig = {
  twitchChannel: 'stormen',
  youtubeHandle: 'stormentv',
  youtubeApiKey: '',
  ...(window.STORMEN_CONFIG || {}),
};

function initTwitchEmbeds() {
  document.querySelectorAll('[data-twitch-src]').forEach((iframe) => {
    const baseSrc = iframe.getAttribute('data-twitch-src');
    const host = window.location.hostname;
    const isLocalFile = window.location.protocol === 'file:';
    const parent = host || 'stormen.tv';

    if (!baseSrc) return;

    const src = isLocalFile
      ? baseSrc
      : `https://player.twitch.tv/?channel=${encodeURIComponent(stormenConfig.twitchChannel)}&muted=true&parent=${encodeURIComponent(parent)}`;

    iframe.setAttribute('src', src);
  });
}

async function initYouTubeVideos() {
  const grid = document.querySelector('[data-youtube-grid]');
  if (!grid) return;

  if (!stormenConfig.youtubeApiKey) {
    return;
  }

  try {
    grid.innerHTML = '<article class="watch-video-placeholder"><h3>Loading latest YouTube videos...</h3></article>';
    const channelId = await getYouTubeChannelId();
    const videos = await getLatestYouTubeVideos(channelId);
    renderYouTubeVideos(grid, videos);
  } catch (error) {
    grid.innerHTML = `
      <article class="watch-video-placeholder">
        <h3>Could not load YouTube videos</h3>
        <p>${escapeHtml(error.message || 'Check the YouTube API key and channel configuration in site.js.')}</p>
        <a href="https://youtube.com/@${escapeHtml(stormenConfig.youtubeHandle)}" target="_blank" rel="noopener noreferrer">Open YouTube</a>
      </article>
    `;
  }
}

async function getYouTubeChannelId() {
  if (stormenConfig.youtubeChannelId) {
    return stormenConfig.youtubeChannelId;
  }

  const handle = String(stormenConfig.youtubeHandle || '').replace(/^@/, '');
  const channelUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
  channelUrl.search = new URLSearchParams({
    part: 'id',
    forHandle: handle,
    key: stormenConfig.youtubeApiKey,
  });

  const channelData = await fetchJson(channelUrl);
  if (channelData.items?.[0]?.id) {
    return channelData.items[0].id;
  }

  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
  searchUrl.search = new URLSearchParams({
    part: 'snippet',
    q: handle,
    type: 'channel',
    maxResults: '1',
    key: stormenConfig.youtubeApiKey,
  });

  const searchData = await fetchJson(searchUrl);
  const channelId = searchData.items?.[0]?.snippet?.channelId || searchData.items?.[0]?.id?.channelId;
  if (!channelId) {
    throw new Error('Could not find the YouTube channel. Add youtubeChannelId to STORMEN_CONFIG.');
  }

  return channelId;
}

async function getLatestYouTubeVideos(channelId) {
  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
  searchUrl.search = new URLSearchParams({
    part: 'snippet',
    channelId,
    type: 'video',
    order: 'date',
    maxResults: '24',
    key: stormenConfig.youtubeApiKey,
  });

  const searchData = await fetchJson(searchUrl);
  const ids = (searchData.items || [])
    .map((item) => item.id?.videoId)
    .filter(Boolean);

  if (!ids.length) {
    return [];
  }

  const detailUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
  detailUrl.search = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: ids.join(','),
    key: stormenConfig.youtubeApiKey,
  });

  const detailData = await fetchJson(detailUrl);
  return (detailData.items || []).map((item) => {
    const seconds = parseYouTubeDuration(item.contentDetails?.duration || 'PT0S');
    return {
      id: item.id,
      title: item.snippet?.title || 'Untitled video',
      thumbnail: item.snippet?.thumbnails?.maxres?.url
        || item.snippet?.thumbnails?.high?.url
        || item.snippet?.thumbnails?.medium?.url,
      publishedAt: item.snippet?.publishedAt,
      views: Number(item.statistics?.viewCount || 0),
      duration: seconds,
      kind: seconds <= 61 ? 'short' : 'video',
    };
  });
}

function renderYouTubeVideos(grid, videos) {
  if (!videos.length) {
    grid.innerHTML = `
      <article class="watch-video-placeholder">
        <h3>No YouTube videos found</h3>
        <p>Check the configured YouTube channel handle or channel ID.</p>
      </article>
    `;
    return;
  }

  grid.innerHTML = videos.slice(0, 12).map((video) => `
    <a href="https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}" target="_blank" rel="noopener noreferrer" class="watch-video-card ${video.kind === 'short' ? 'is-short' : ''}" data-video-kind="${video.kind}">
      <div class="watch-video-thumb real-thumb" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.58)), url('${escapeHtml(video.thumbnail || '')}')">
        <time>${formatDuration(video.duration)}</time>
      </div>
      <strong>${escapeHtml(video.title)}</strong>
      <p>${formatRelativeDate(video.publishedAt)} - ${formatViews(video.views)} views</p>
    </a>
  `).join('');
}

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Request failed.');
  }
  return data;
}

function parseYouTubeDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, hours = 0, minutes = 0, seconds = 0] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatViews(views) {
  if (views >= 1000000) return `${(views / 1000000).toFixed(views >= 10000000 ? 0 : 1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(views >= 10000 ? 0 : 1)}K`;
  return String(views);
}

function formatRelativeDate(dateString) {
  if (!dateString) return 'Recently';
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.max(0, Math.floor(diff / 86400000));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return months <= 1 ? '1 month ago' : `${months} months ago`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initRollingScheduleDates() {
  const scheduleItems = document.querySelectorAll('[data-schedule-day]');
  if (!scheduleItems.length) return;

  const today = new Date();
  const dayOfWeek = today.getDay() || 7;
  const monday = new Date(today);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(today.getDate() - dayOfWeek + 1);

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  });

  scheduleItems.forEach((item) => {
    const scheduleDay = Number(item.dataset.scheduleDay || 1);
    const date = new Date(monday);
    date.setDate(monday.getDate() + scheduleDay - 1);

    const dayLabel = item.querySelector('strong');
    const dateLabel = item.querySelector('strong span');
    if (!dayLabel || !dateLabel) return;

    const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][scheduleDay - 1];
    dayLabel.firstChild.textContent = `${weekday} `;
    dateLabel.textContent = formatter.format(date);

    item.classList.toggle('is-today', scheduleDay === dayOfWeek);
    const status = item.querySelector('.schedule-status');
    if (status) {
      if (scheduleDay === dayOfWeek) {
        status.textContent = item.classList.contains('is-muted') ? 'Today / offline' : 'Today';
      } else if (scheduleDay < dayOfWeek) {
        status.textContent = item.classList.contains('is-muted') ? 'Offline' : 'Earlier this week';
      } else if (scheduleDay > dayOfWeek && !item.classList.contains('is-muted')) {
        status.textContent = 'Upcoming';
      }
    }
  });
}

function initProductImageSwaps() {
  document.querySelectorAll('.shop-card .swap-image').forEach((swapImage) => {
    const card = swapImage.closest('.shop-card');
    if (!card) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let didSwipe = false;

    const toggleSwap = () => {
      card.classList.toggle('is-swapped');
    };

    swapImage.addEventListener('touchstart', (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      didSwipe = false;
    }, { passive: true });

    swapImage.addEventListener('touchend', (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) > 34 && Math.abs(deltaX) > Math.abs(deltaY)) {
        event.preventDefault();
        didSwipe = true;
        toggleSwap();
      }
    });

    card.addEventListener('click', (event) => {
      if (!didSwipe || !card.classList.contains('is-swapped')) return;
      event.preventDefault();
      didSwipe = false;
    });
  });
}

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const status = form.querySelector('[data-contact-status]');
  const submitButton = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) {
        status.textContent = 'Please fill out every field before sending.';
        status.classList.add('is-error');
        status.classList.remove('is-success');
      }
      return;
    }

    const formData = new FormData(form);
    const inquiry = String(formData.get('inquiry') || '').trim();
    formData.append('_subject', `Stormen contact: ${inquiry}`);

    if (status) {
      status.textContent = 'Sending your message...';
      status.classList.remove('is-error');
      status.classList.remove('is-success');
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Formspree rejected the submission.');
      }

      form.reset();
      if (status) {
        status.textContent = 'Message sent. Thanks, I will get back to you soon.';
        status.classList.add('is-success');
        status.classList.remove('is-error');
      }
    } catch (error) {
      if (status) {
        status.textContent = 'Something went wrong. Please email stormen@thenewgen.com directly.';
        status.classList.add('is-error');
        status.classList.remove('is-success');
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
