#!/bin/bash

# Script to generate Open Graph image using ImageMagick
# Requires ImageMagick to be installed: sudo apt-get install imagemagick

# Image dimensions
WIDTH=1200
HEIGHT=630

# Colors
BG_COLOR="#667eea"
CARD_COLOR="#ffffff"
TEXT_DARK="#2d3748"
TEXT_LIGHT="#718096"
ACCENT_COLOR="#3b82f6"

# Create the base image with gradient background
convert -size ${WIDTH}x${HEIGHT} \
    gradient:${BG_COLOR}-"#764ba2" \
    -gravity center \
    \( -size 1040x470 xc:${CARD_COLOR} -draw "roundrectangle 0,0 1040,470 24,24" \) \
    -geometry +0+0 -composite \
    /tmp/og_base.png

# Add title text
convert /tmp/og_base.png \
    -font /usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf \
    -pointsize 48 \
    -fill ${TEXT_DARK} \
    -gravity northwest \
    -annotate +280+180 "DevTools" \
    /tmp/og_with_title.png

# Add subtitle
convert /tmp/og_with_title.png \
    -font /usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf \
    -pointsize 24 \
    -fill ${TEXT_LIGHT} \
    -gravity northwest \
    -annotate +280+220 "Free Developer Tools" \
    /tmp/og_with_subtitle.png

# Add domain
convert /tmp/og_with_subtitle.png \
    -font /usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf \
    -pointsize 20 \
    -fill ${ACCENT_COLOR} \
    -gravity northwest \
    -annotate +280+260 "tools.khanhnd.com" \
    /tmp/og_with_domain.png

# Add feature badges
convert /tmp/og_with_domain.png \
    -fill ${ACCENT_COLOR} \
    -draw "roundrectangle 120,420 320,460 20,20" \
    -font /usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf \
    -pointsize 14 \
    -fill white \
    -gravity northwest \
    -annotate +140+445 "🔒 100% Client-Side" \
    /tmp/og_with_badges.png

# Add tool count badge
convert /tmp/og_with_badges.png \
    -fill "#10b981" \
    -draw "roundrectangle 340,420 460,460 20,20" \
    -font /usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf \
    -pointsize 14 \
    -fill white \
    -gravity northwest \
    -annotate +360+445 "⚡ 15+ Tools" \
    /tmp/og_with_count.png

# Add free badge  
convert /tmp/og_with_count.png \
    -fill "#8b5cf6" \
    -draw "roundrectangle 480,420 580,460 20,20" \
    -font /usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf \
    -pointsize 14 \
    -fill white \
    -gravity northwest \
    -annotate +500+445 "💎 Free" \
    images/og-image.png

# Cleanup temporary files
rm /tmp/og_*.png

echo "✅ Open Graph image created at images/og-image.png"
echo "📏 Size: ${WIDTH}x${HEIGHT}px"
echo "🌐 URL: https://tools.khanhnd.com/images/og-image.png"
echo ""
echo "Next steps:"
echo "1. Verify the image looks good"
echo "2. Test on social media debuggers"
echo "3. Commit and push to GitHub"
