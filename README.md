# Nameless Esports Website

A modern, professional esports website built with Next.js, featuring Start.gg API integration, authentication, and real-time tournament data.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Start.gg API key
- Discord and Google OAuth credentials (for authentication)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following variables:

```env
# Start.gg API Configuration
STARTGG_API_KEY=2bc6a7c648f8c29c21263ff7fe88d567
NEXT_PUBLIC_STARTGG_API_URL=https://api.start.gg/gql/alpha

# Discord OAuth (optional - for authentication)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# Google OAuth (optional - for authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- 🎮 **Tournament Management**: Integration with Start.gg API for real-time tournament data
- 🔐 **Authentication**: Discord and Google OAuth login support
- 📰 **News System**: Dynamic news ticker and blog functionality
- 🏆 **Standings Display**: Live tournament results and standings
- 📊 **Staff Dashboard**: Protected admin area for managing content
- 🎓 **Nameless Initiative**: Dedicated section for high school esports league

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Custom CSS
- **Authentication**: NextAuth.js
- **API Integration**: Start.gg GraphQL API, Liquipedia API (planned)
- **Animations**: Framer Motion
- **Icons**: React Icons

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── tournaments/       # Tournaments listing
│   ├── news/              # News/blog section
│   ├── initiative/        # Nameless Initiative League
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Utility functions and API clients
│   └── startgg.ts        # Start.gg API utilities
└── styles/               # Global styles

```

## API Documentation

### Start.gg Integration

The website uses the Start.gg GraphQL API to fetch tournament data. Key functions in `lib/startgg.ts`:

- `fetchTournamentsByOwner(ownerId)` - Get tournaments for an organization
- `fetchRecentEvents(limit)` - Get recent event results
- `fetchTournamentBySlug(slug)` - Get specific tournament details

## Contributing

This is a private project for Nameless Esports. Contact the development team for contribution guidelines.

## License

Proprietary - All rights reserved by Nameless Esports
