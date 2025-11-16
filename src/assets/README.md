# aura Assets

This folder contains all media assets for the aura VR Therapy platform.

## Required Assets

### 1. Background Video
**File**: `aurora-background.mp4`
- **Description**: Full-screen looping background video for the hero section
- **Recommended**: Nighttime forest scene with aurora borealis (northern lights)
- **Resolution**: 1920x1080 or higher
- **Duration**: 30-60 seconds (will loop)
- **Format**: MP4 (H.264 codec)
- **Size**: Optimized, under 10MB recommended

**Where to find**:
- Search for "aurora borealis forest night" on stock video sites
- Pexels, Pixabay, Unsplash (free options)
- Or create your own aurora-themed animation

### 2. Logo
**File**: `logo.svg`
- **Description**: aura brand logo
- **Format**: SVG (vector)
- **Color**: Can be white or gradient (purple to pink)
- **Usage**: Navbar, footer, loading screens

**Quick SVG Logo** (you can use this):
```svg
<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#EC4899;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="10" y="45" font-family="Inter, sans-serif" font-size="40" font-weight="bold" fill="url(#logoGradient)">
    aura
  </text>
</svg>
```

### 3. Additional Assets (Optional)

#### Therapy Session Thumbnails
- Create custom thumbnail images for each therapy session
- Use calming, abstract imagery
- Recommended: 800x600px, JPEG or PNG

#### Icons
- VR headset icons for different platforms
- Feature icons for the landing page
- Currently using emoji placeholders (🧘, 🌊, etc.)

## File Structure

```
assets/
├── aurora-background.mp4   (Required)
├── logo.svg                (Required)
├── thumbnails/             (Optional)
│   ├── meditation.jpg
│   ├── anxiety-relief.jpg
│   ├── sleep-stories.jpg
│   └── ...
└── icons/                  (Optional)
    ├── meta-quest.svg
    ├── playstation-vr.svg
    └── ...
```

## Quick Setup

If you don't have assets yet, the site will still work with:
- Gradient background fallback (no video)
- Text-based logo
- Emoji icons and placeholders

## Asset Optimization Tips

1. **Video Compression**: Use HandBrake or FFmpeg to compress videos
   ```bash
   ffmpeg -i input.mp4 -vcodec h264 -b:v 2000k aurora-background.mp4
   ```

2. **Image Optimization**: Use tools like TinyPNG or ImageOptim

3. **SVG Optimization**: Use SVGO to minimize SVG file sizes

## License Notes

Ensure all assets you use are:
- Royalty-free or properly licensed
- Credited if required
- Optimized for web use

---

**Need help finding assets?** Check the README.md in the root folder for resources.
