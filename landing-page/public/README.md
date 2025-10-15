# Public Assets Directory

This directory contains static files served directly by Next.js.

## Current Files

- None yet (add your assets below)

## Recommended Assets to Add

### Required for Production
- **favicon.ico** - Browser tab icon (32x32 or 16x16 px)
- **apple-touch-icon.png** - iOS home screen icon (180x180 px)
- **manifest.json** - Progressive Web App manifest

### Optional
- **robots.txt** - Search engine crawling instructions
- **logo.svg** or **logo.png** - Company logo
- **og-image.jpg** - Open Graph social media preview (1200x630 px)

## Adding Assets

Simply place files in this directory and reference them from components:

```tsx
// In any component
<Image src="/logo.png" alt="Logo" width={200} height={100} />

// Or as regular img tag
<img src="/logo.png" alt="Logo" />
```

## Favicon Instructions

### Quick Option: Use a Favicon Generator
1. Go to https://favicon.io/ or https://realfavicongenerator.net/
2. Upload your logo or design
3. Download the generated files
4. Place them in this directory

### Files to Generate
- `favicon.ico` - Main favicon
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

### Update Layout
Add to `app/layout.tsx` in the `<head>` section:

```tsx
export const metadata = {
  // ... existing metadata
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}
```

## Current Assets Status

⚠️ **No assets added yet** - This is fine for local development but should be added before production deployment.

Minimum for production:
- [ ] favicon.ico
- [ ] apple-touch-icon.png
- [ ] Company logo (optional but recommended)

