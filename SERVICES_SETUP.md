# Services Page & YouTube Feed Setup

## Services Page

The services page is located at `/services` and showcases:

- **5 Service Packages:**
  - Casting & Commentary (30+ professional casters)
  - Full Production Package (production coordinators, streaming, graphics)
  - Social Media Management (2+ social media coordinators)
  - Tournament Administration (tournament admins)
  - Custom Solutions (mix and match services)

- **Team Overview Section:** Displays team statistics
- **Latest Broadcasts Section:** YouTube video feed integration
- **Call-to-Action Section:** Contact information

## YouTube Feed Integration

### Files Created
- `app/services/page.tsx` - Main services page
- `app/services/services.module.css` - Styling
- `app/api/youtube-feed/route.ts` - API endpoint to fetch videos

### Setup Instructions

#### Option 1: Using YouTube API (Recommended)

1. **Get a YouTube API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable the "YouTube Data API v3"
   - Create an API key in Credentials

2. **Get Your Channel ID:**
   - Go to your [YouTube Channel](https://www.youtube.com/@YourChannel)
   - Click "About" tab
   - Copy the Channel ID from the URL: `youtube.com/@YourChannel` or find it in Channel details

3. **Add to `.env.local`:**
   ```env
   YOUTUBE_API_KEY=your_api_key_here
   YOUTUBE_CHANNEL_ID=your_channel_id_here
   ```

4. **Restart your dev server:**
   ```bash
   npm run dev
   ```

The feed will now automatically fetch your latest 12 videos and cache them for 1 hour.

#### Option 2: Using Mock Data (Current State)

If you don't set `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID`, the API returns beautiful mock data with placeholder videos. This is perfect for development.

### Features

✅ **No Embeds** - Videos are fetched via API and displayed as cards
✅ **Responsive Grid** - Auto-adjusts for mobile, tablet, and desktop
✅ **Hover Effects** - Play button overlay on hover
✅ **Proper Thumbnails** - Medium quality YouTube thumbnails (320x180)
✅ **Click to YouTube** - Links open videos in new tab
✅ **Caching** - 1-hour cache for API responses
✅ **Fallback** - Mock data shown if API is unavailable

### Video Card Features

- **Thumbnail Image** - YouTube's official thumbnail
- **Video Title** - Truncated to 2 lines
- **Channel Name** - Shows your channel
- **Publish Date** - Formatted date (e.g., "Dec 26, 2025")
- **Play Icon** - Appears on hover
- **Link** - Direct to YouTube video

### Styling

The videos section uses the site's existing gradient color scheme:
- Dark background with subtle gradients
- Neon pink (#ff0096) and cyan (#00a8ff) accents
- Smooth hover animations
- Mobile-responsive layout

### API Response Format

```typescript
{
  videos: [
    {
      id: string;           // YouTube video ID
      title: string;        // Video title
      thumbnail: string;    // URL to thumbnail image
      publishedAt: string;  // ISO date string
      channelTitle: string; // Channel name
      videoUrl: string;     // Full YouTube URL
    }
  ]
}
```

### Customization

**Change number of videos displayed:**
Edit `app/api/youtube-feed/route.ts` line 73:
```typescript
searchUrl.searchParams.append('maxResults', '12'); // Change 12 to desired number
```

**Change cache duration:**
Edit `app/api/youtube-feed/route.ts` line 76:
```typescript
next: { revalidate: 3600 } // Change 3600 (seconds) to preferred duration
```

**Modify grid layout:**
Edit `app/services/services.module.css` `.videosGrid`:
```css
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
```

## Navigation Updates

The Services link has been added to:
- Desktop navigation menu
- Mobile navigation menu

## Testing

1. **With Mock Data (No API Key):**
   ```bash
   npm run dev
   # Visit http://localhost:3000/services
   ```

2. **With Real YouTube Data:**
   ```bash
   # Add credentials to .env.local
   npm run dev
   # Visit http://localhost:3000/services
   # Should show your actual latest videos
   ```

## Troubleshooting

**Videos not loading?**
- Check browser console for errors
- Verify API key in `.env.local`
- Ensure YouTube Data API is enabled in Google Cloud
- Check that channel ID is correct

**Wrong videos showing?**
- Double-check `YOUTUBE_CHANNEL_ID`
- Make sure the channel has public videos

**API errors?**
- The API gracefully falls back to returning an empty array
- Mock data is shown in development if credentials aren't set

## Future Enhancements

- [ ] Add search/filter by category
- [ ] Add video descriptions in modal
- [ ] Add view count display
- [ ] Add like count from YouTube API
- [ ] Implement pagination for more videos
