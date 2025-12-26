import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if YouTube API key is configured
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    // If credentials are not set, return mock data or error
    if (!youtubeApiKey || !channelId) {
      // Return mock data for demonstration
      return NextResponse.json({
        videos: [
          {
            id: 'demo1',
            title: 'Rocket League Championship - Grand Finals',
            thumbnail: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=225&fit=crop',
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            channelTitle: 'Nameless Esports',
            videoUrl: 'https://youtube.com'
          },
          {
            id: 'demo2',
            title: 'Production Highlight Reel - 2025',
            thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=225&fit=crop',
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            channelTitle: 'Nameless Esports',
            videoUrl: 'https://youtube.com'
          },
          {
            id: 'demo3',
            title: 'Behind the Scenes - Casting Setup',
            thumbnail: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=225&fit=crop',
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            channelTitle: 'Nameless Esports',
            videoUrl: 'https://youtube.com'
          },
          {
            id: 'demo4',
            title: 'Team Interview - Championship Winners',
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70a504f0?w=400&h=225&fit=crop',
            publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            channelTitle: 'Nameless Esports',
            videoUrl: 'https://youtube.com'
          },
          {
            id: 'demo5',
            title: 'Tournament Highlights - Week 5',
            thumbnail: 'https://images.unsplash.com/photo-1570303782288-f0f50670cec9?w=400&h=225&fit=crop',
            publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            channelTitle: 'Nameless Esports',
            videoUrl: 'https://youtube.com'
          },
          {
            id: 'demo6',
            title: 'Caster Showcase - Top Moments',
            thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=225&fit=crop',
            publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            channelTitle: 'Nameless Esports',
            videoUrl: 'https://youtube.com'
          }
        ]
      });
    }

    // Fetch from YouTube API
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.append('key', youtubeApiKey);
    searchUrl.searchParams.append('channelId', channelId);
    searchUrl.searchParams.append('part', 'snippet');
    searchUrl.searchParams.append('order', 'date');
    searchUrl.searchParams.append('maxResults', '12');
    searchUrl.searchParams.append('type', 'video');

    const response = await fetch(searchUrl.toString(), {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from YouTube API');
    }

    const data = await response.json();

    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('YouTube API Error:', error);
    // Return empty array on error instead of failing
    return NextResponse.json({ videos: [] });
  }
}
