# Nameless Esports Email Templates

## How to Use

Replace these variables in `base-template.html`:

### Required Variables:
- `{{TITLE}}` - Main heading (e.g., "Welcome to Nameless!")
- `{{MESSAGE}}` - Main body message (supports HTML)
- `{{CTA_TEXT}}` - Main button text (e.g., "View Tournament")
- `{{CTA_URL}}` - Main button link URL

### Optional Variables:
- `{{HIGHLIGHT_LABEL}}` - Label above highlighted box (e.g., "Your 2FA Code")
- `{{HIGHLIGHT_VALUE}}` - Large value in highlighted box (e.g., "123456")
- `{{CONTENT_TITLE}}` - Title for content section below highlight box
- `{{CONTENT_DESCRIPTION}}` - Description for content section
- `{{CTA_TEXT_1}}` - First mini-CTA button text
- `{{CTA_LINK_1}}` - First mini-CTA button link
- `{{CTA_TEXT_2}}` - Second mini-CTA button text
- `{{CTA_LINK_2}}` - Second mini-CTA button link
- `{{SECONDARY_MESSAGE}}` - Additional info below main button
- `{{UNSUBSCRIBE_URL}}` - Unsubscribe link

### Remove Sections You Don't Need:
- Remove the "HIGHLIGHTED BOX" section if not showing codes/stats
- Remove the "ADDITIONAL CONTENT SECTION" if not needed
- Remove the "CTA BUTTON" section if no main action needed
- Keep the header and footer always

## Example: 2FA Code Email

```javascript
const html = template
  .replace('{{TITLE}}', 'Your 2FA Code')
  .replace('{{MESSAGE}}', 'Use the code below to complete your login:')
  .replace('{{HIGHLIGHT_LABEL}}', 'Verification Code')
  .replace('{{HIGHLIGHT_VALUE}}', '123456')
  .replace('{{CONTENT_TITLE}}', 'Security Tips')
  .replace('{{CONTENT_DESCRIPTION}}', 'Keep your account secure by never sharing your codes.')
  .replace('{{CTA_TEXT_1}}', 'Security Guide')
  .replace('{{CTA_LINK_1}}', 'https://namelessesports.com/security')
  .replace('{{CTA_TEXT_2}}', 'Contact Support')
  .replace('{{CTA_LINK_2}}', 'https://namelessesports.com/contact')
  .replace('{{CTA_TEXT}}', 'Return to Login')
  .replace('{{CTA_URL}}', 'https://namelessesports.com/login')
  .replace('{{SECONDARY_MESSAGE}}', 'This code expires in 5 minutes.')
  .replace('{{UNSUBSCRIBE_URL}}', '#');
```

## Features:
✅ **Fully responsive** - Stacks beautifully on mobile devices
✅ **Works everywhere** - Gmail, Outlook, Apple Mail, etc.
✅ **Dark theme** with purple/pink gradient branding
✅ **Nameless logo** in header
✅ **White social icons** (Discord, X, Twitch)
✅ **Mobile-optimized** - Buttons stack vertically on small screens
✅ **Accessible** and screen-reader friendly
✅ **Inline CSS** for maximum compatibility

## Example: Tournament Invite

```javascript
const html = template
  .replace('{{TITLE}}', 'You're Invited! 🏆')
  .replace('{{MESSAGE}}', 'Your team has been invited to compete in the <strong>Winter Championship</strong>. Register now to secure your spot!')
  .replace('{{HIGHLIGHT_LABEL}}', 'Tournament Date')
  .replace('{{HIGHLIGHT_VALUE}}', 'JAN 15')
  .replace('{{CTA_TEXT}}', 'Register Team')
  .replace('{{CTA_URL}}', 'https://namelessesports.com/esports/events/winter-championship')
  .replace('{{SECONDARY_MESSAGE}}', 'Limited spots available - First come, first served!')
  .replace('{{UNSUBSCRIBE_URL}}', '#');
```

## Features:
✅ Fully responsive (mobile-friendly)
✅ Works on all major email clients (Gmail, Outlook, Apple Mail, etc.)
✅ Dark theme with brand gradient colors
✅ Social media links in footer
✅ Accessible and screen-reader friendly
✅ Inline CSS for maximum compatibility
