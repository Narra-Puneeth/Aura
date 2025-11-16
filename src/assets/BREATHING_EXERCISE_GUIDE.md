# Adding Breathing Exercise Video/GIF

## Location
The "Stop scrolling and take a deep breath" section on the Landing page displays a breathing exercise video or GIF.

## File Setup

### Option 1: Video File (Recommended)
1. **Download or create** a breathing exercise video (e.g., expanding circle animation, "breathe in/out" text)
2. **Save as**: `breathing-exercise.mp4` or `breathing-exercise.webm`
3. **Place in**: `src/assets/` folder
4. **Update** `Landing.jsx` line ~170:
   ```jsx
   <video
     autoPlay
     loop
     muted
     playsInline
     className="absolute inset-0 w-full h-full object-cover"
   >
     <source src="/assets/breathing-exercise.mp4" type="video/mp4" />
   </video>
   ```

### Option 2: Animated GIF
1. **Download or create** a breathing GIF
2. **Save as**: `breathing-exercise.gif`
3. **Place in**: `src/assets/` folder
4. **Update** `Landing.jsx` line ~170:
   ```jsx
   <img
     src="/assets/breathing-exercise.gif"
     alt="Breathing Exercise"
     className="absolute inset-0 w-full h-full object-cover"
   />
   ```

## Free Resources

### Breathing Exercise Videos
- **Pexels**: https://www.pexels.com/search/videos/breathing%20exercise/
- **Pixabay**: https://pixabay.com/videos/search/meditation%20breathing/
- **Coverr**: https://coverr.co/search?q=meditation

### Create Your Own
- **Canva**: Create animated breathing circles (free templates)
- **After Effects**: Custom animations
- **Online Tools**: LottieFiles, Giphy GIF maker

## Recommended Specs

### For Video
- **Resolution**: 1920x1080 or 1280x720
- **Duration**: 10-30 seconds (will loop)
- **Format**: MP4 (H.264)
- **Size**: < 5MB (compress if needed)
- **Content**: 
  - Expanding/contracting circle
  - "Breathe In / Hold / Breathe Out" text
  - Calming colors (blues, purples, greens)
  - Slow, rhythmic animation

### For GIF
- **Resolution**: 800x450 or 1280x720
- **Frame Rate**: 15-30 fps
- **Size**: < 2MB
- **Content**: Same as video

## Animation Timing (Best Practices)
- **Inhale**: 4-5 seconds
- **Hold**: 2-3 seconds
- **Exhale**: 6-7 seconds
- **Pause**: 1-2 seconds
- **Total Cycle**: ~15-20 seconds

## Example Content Ideas

### 1. Circle Animation
- Slowly expanding circle = Breathe In
- Hold at full size = Hold
- Slowly shrinking circle = Breathe Out
- Brief pause = Rest

### 2. Text Animation
```
"Breathe In" (4 sec fade in)
"Hold" (2 sec hold)
"Breathe Out" (6 sec fade out)
(Loop)
```

### 3. Nature Scene
- Ocean waves with breathing rhythm
- Flower blooming/closing
- Clouds drifting slowly

### 4. Abstract Gradient
- Gradient shifting colors slowly
- Smooth transitions
- Calming purple/blue tones

## Current Placeholder
The current placeholder shows:
- Glass morphism card
- Play button icon
- Instructions text
- Gradient background

Once you add your video/GIF, it will replace this placeholder automatically.

## Testing
1. Add your file to `src/assets/`
2. Update `Landing.jsx` as shown above
3. Refresh browser
4. Scroll to bottom of landing page
5. Verify video/GIF plays and loops smoothly

## Troubleshooting

### Video Not Playing
- Check file path: `/assets/breathing-exercise.mp4`
- Verify file is in `public/assets/` or `src/assets/`
- Check browser console for errors
- Try different video format (MP4 vs WebM)

### GIF Not Loading
- Check file size (compress if > 2MB)
- Verify correct path
- Try converting to video for better performance

### Performance Issues
- Compress video/GIF
- Reduce resolution
- Use WebM format for smaller file size
- Add lazy loading if needed

## Need Help?
- Check browser console for errors
- Verify file paths match exactly
- Test with a simple test.mp4 first
- Ensure file is accessible from public folder

---

**Quick Start**: Just add `breathing-exercise.mp4` to `src/assets/` and update the video src in `Landing.jsx`!
