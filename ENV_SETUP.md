# Environment Variables for Authentication

Add these to your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Discord OAuth (https://discord.com/developers/applications)
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Google OAuth (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# SendGrid (https://app.sendgrid.com/settings/api_keys)
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@namelessesports.com"

# Database (already configured)
DATABASE_URL="postgresql://..."
```

## How to Get OAuth Credentials:

### Discord:
1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Go to "OAuth2" → "General"
4. Add redirect URL: `http://localhost:3000/api/auth/callback/discord`
5. Copy Client ID and Client Secret

### Google:
1. Go to https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: "Web application"
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret

### SendGrid:
1. Go to https://app.sendgrid.com/settings/api_keys
2. Click "Create API Key"
3. Choose "Full Access"
4. Copy the API key (shown only once!)
5. Verify your sender email in SendGrid settings

## Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32
