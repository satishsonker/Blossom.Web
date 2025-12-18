# Logo Setup Guide for Blossom Website

This guide will help you generate all the required icon files from your logo image.

## Logo Description
- **Letter**: Bold black capital "B"
- **Vine**: Green vine wrapping around the letter with two leaves
- **Flowers**: Two pink tulip-like flowers (top and bottom)
- **Background**: Light blue (#87CEEB)

## Required Icon Sizes

### Standard Icons
- `favicon.ico` - 16x16, 32x32, 48x48 (multi-size ICO file)
- `icon-16x16.png` - 16x16
- `icon-32x32.png` - 32x32
- `icon-96x96.png` - 96x96

### Apple Touch Icons
- `apple-icon-57x57.png` - 57x57
- `apple-icon-60x60.png` - 60x60
- `apple-icon-72x72.png` - 72x72
- `apple-icon-76x76.png` - 76x76
- `apple-icon-114x114.png` - 114x114 (2x for 57x57)
- `apple-icon-120x120.png` - 120x120 (2x for 60x60)
- `apple-icon-144x144.png` - 144x144 (2x for 72x72)
- `apple-icon-152x152.png` - 152x152 (2x for 76x76)
- `apple-icon-180x180.png` - 180x180 (3x for 60x60)

### Android PWA Icons
- `android-icon-192x192.png` - 192x192
- `android-icon-512x512.png` - 512x512

### Manifest Icons
- `icon-72x72.png` - 72x72
- `icon-96x96.png` - 96x96
- `icon-128x128.png` - 128x128
- `icon-144x144.png` - 144x144
- `icon-152x152.png` - 152x152
- `icon-192x192.png` - 192x192
- `icon-384x384.png` - 384x384
- `icon-512x512.png` - 512x512

### Retina Versions (2x)
- `icon-32x32@2x.png` - 64x64
- `icon-96x96@2x.png` - 192x192
- `icon-192x192@2x.png` - 384x384

### Retina Versions (3x)
- `icon-32x32@3x.png` - 96x96
- `icon-96x96@3x.png` - 288x288
- `icon-192x192@3x.png` - 576x576

## Tools for Generating Icons

### Option 1: Online Tools (Recommended)

1. **RealFaviconGenerator** (https://realfavicongenerator.net/)
   - Upload your logo image
   - Select all platforms (iOS, Android, Windows, etc.)
   - Download the generated package
   - Extract to `public/assets/images/icons/`

2. **Favicon.io** (https://favicon.io/)
   - Upload your logo
   - Generate all sizes
   - Download and extract

3. **AppIcon.co** (https://www.appicon.co/)
   - Upload your logo
   - Generate iOS and Android icons
   - Download package

### Option 2: ImageMagick (Command Line)

```bash
# Install ImageMagick first
# Then run these commands from your logo source file

# Create icons directory
mkdir -p public/assets/images/icons

# Generate standard icons
convert logo.png -resize 16x16 public/assets/images/icons/icon-16x16.png
convert logo.png -resize 32x32 public/assets/images/icons/icon-32x32.png
convert logo.png -resize 96x96 public/assets/images/icons/icon-96x96.png

# Generate Apple icons
convert logo.png -resize 57x57 public/assets/images/icons/apple-icon-57x57.png
convert logo.png -resize 60x60 public/assets/images/icons/apple-icon-60x60.png
convert logo.png -resize 72x72 public/assets/images/icons/apple-icon-72x72.png
convert logo.png -resize 76x76 public/assets/images/icons/apple-icon-76x76.png
convert logo.png -resize 114x114 public/assets/images/icons/apple-icon-114x114.png
convert logo.png -resize 120x120 public/assets/images/icons/apple-icon-120x120.png
convert logo.png -resize 144x144 public/assets/images/icons/apple-icon-144x144.png
convert logo.png -resize 152x152 public/assets/images/icons/apple-icon-152x152.png
convert logo.png -resize 180x180 public/assets/images/icons/apple-icon-180x180.png

# Generate Android icons
convert logo.png -resize 192x192 public/assets/images/icons/android-icon-192x192.png
convert logo.png -resize 512x512 public/assets/images/icons/android-icon-512x512.png

# Generate manifest icons
convert logo.png -resize 72x72 public/assets/images/icons/icon-72x72.png
convert logo.png -resize 128x128 public/assets/images/icons/icon-128x128.png
convert logo.png -resize 144x144 public/assets/images/icons/icon-144x144.png
convert logo.png -resize 152x152 public/assets/images/icons/icon-152x152.png
convert logo.png -resize 192x192 public/assets/images/icons/icon-192x192.png
convert logo.png -resize 384x384 public/assets/images/icons/icon-384x384.png
convert logo.png -resize 512x512 public/assets/images/icons/icon-512x512.png

# Generate Retina 2x versions
convert logo.png -resize 64x64 public/assets/images/icons/icon-32x32@2x.png
convert logo.png -resize 192x192 public/assets/images/icons/icon-96x96@2x.png
convert logo.png -resize 384x384 public/assets/images/icons/icon-192x192@2x.png

# Generate Retina 3x versions
convert logo.png -resize 96x96 public/assets/images/icons/icon-32x32@3x.png
convert logo.png -resize 288x288 public/assets/images/icons/icon-96x96@3x.png
convert logo.png -resize 576x576 public/assets/images/icons/icon-192x192@3x.png

# Generate favicon.ico (multi-size)
convert logo.png -define icon:auto-resize=16,32,48 public/assets/images/icons/favicon.ico
```

### Option 3: Photoshop/GIMP Script

1. Open your logo in Photoshop/GIMP
2. Create actions/scripts for each size
3. Export all sizes with proper naming

## File Structure

After generating all icons, your directory structure should look like:

```
public/
  assets/
    images/
      icons/
        favicon.ico
        icon-16x16.png
        icon-32x32.png
        icon-32x32@2x.png
        icon-32x32@3x.png
        icon-72x72.png
        icon-96x96.png
        icon-96x96@2x.png
        icon-96x96@3x.png
        icon-128x128.png
        icon-144x144.png
        icon-152x152.png
        icon-192x192.png
        icon-192x192@2x.png
        icon-192x192@3x.png
        icon-384x384.png
        icon-512x512.png
        apple-icon-57x57.png
        apple-icon-60x60.png
        apple-icon-72x72.png
        apple-icon-76x76.png
        apple-icon-114x114.png
        apple-icon-120x120.png
        apple-icon-144x144.png
        apple-icon-152x152.png
        apple-icon-180x180.png
        android-icon-192x192.png
        android-icon-512x512.png
      logo.svg (already created)
      logo.png (your source logo with transparent background)
```

## SVG Logo

An SVG version of the logo has been created at:
`public/assets/images/logo.svg`

This is a vector version that scales perfectly at any size. You can edit this file directly if needed.

## Testing

After adding all icons:

1. **Test Favicon**: Check browser tab shows the icon
2. **Test Apple Icons**: Add to home screen on iOS device
3. **Test Android Icons**: Add to home screen on Android device
4. **Test PWA**: Check manifest.json is loaded correctly
5. **Test Retina**: View on high-DPI displays

## Quick Start (Using RealFaviconGenerator)

1. Go to https://realfavicongenerator.net/
2. Upload your logo image (PNG with transparent background recommended)
3. Configure options:
   - iOS: Enable all sizes
   - Android: Enable Chrome and manifest
   - Windows: Enable tile icons
   - Safari: Enable pinned tab icon
4. Click "Generate your Favicons and HTML code"
5. Download the package
6. Extract all files to `public/assets/images/icons/`
7. The HTML code is already added to `index.html`

## Notes

- **Transparent Background**: Ensure your logo has a transparent background for best results
- **Square Format**: Icons work best when the logo is centered in a square canvas
- **Padding**: Add some padding around your logo (10-20% of canvas size)
- **High Resolution**: Start with a high-resolution source image (at least 1024x1024)
- **PNG Format**: Use PNG for all icon files (except .ico for favicon)

## Current Status

✅ `manifest.json` - Created
✅ `logo.svg` - Created (vector version)
✅ `index.html` - Updated with all icon links
⏳ Icon files - Need to be generated from your logo image

Once you generate and place all icon files in `public/assets/images/icons/`, your website will have complete icon support!

