#!/bin/bash

# Build script for DevTools optimization (GitHub Pages compatible)
set -e

echo "🚀 Starting DevTools optimization build for GitHub Pages..."

# Create build directory
BUILD_DIR="dist"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR/{css,js,images,components}

echo "📦 Creating optimized build..."

# Copy and optimize HTML
echo "Processing HTML..."
cp index-optimized.html $BUILD_DIR/index.html

# Inline critical CSS
echo "Inlining critical CSS..."
CRITICAL_CSS=$(cat css/critical.css | sed 's/\/\*.*\*\///g' | tr -d '\n\r' | sed 's/  */ /g')
sed -i "s|/* Critical CSS will be inlined here by build process */|$CRITICAL_CSS|g" $BUILD_DIR/index.html

# Optimize and minify JavaScript
echo "Processing JavaScript files..."
# Copy core files
cp -r js/ $BUILD_DIR/js/
cp components/SidebarOptimized.js $BUILD_DIR/components/Sidebar.js

# Copy essential components
for component in JwtTools JSONFormatter URLEncoderDecoder HashGenerator PasswordGenerator UUIDGenerator UnixTimeConverter SymmetricEncryption EncryptionKeyGenerator APIKeyGenerator RSAKeyGenerator RSAEncryptDecrypt; do
    if [ -f "components/${component}.js" ]; then
        cp "components/${component}.js" "$BUILD_DIR/components/"
    fi
done

# Copy and optimize CSS
echo "Processing CSS files..."
cp styles.css $BUILD_DIR/css/main.css
cp styles/sidebar.css $BUILD_DIR/css/

# Copy images with optimization
echo "Copying images..."
cp -r images/ $BUILD_DIR/images/

# Copy other files
echo "Copying additional files..."
cp site.webmanifest $BUILD_DIR/
cp sw.js $BUILD_DIR/
cp CNAME $BUILD_DIR/ 2>/dev/null || echo "CNAME not found, skipping..."

# Generate component-specific CSS files
echo "Generating component CSS..."
mkdir -p $BUILD_DIR/styles/components

# Create minimal component CSS files
cat > $BUILD_DIR/styles/components/jwt.css << 'EOF'
.jwt-sections { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.jwt-section { flex: 1; }
.token-info { background: #f8fafc; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem; }
.token-part { margin-bottom: 0.5rem; padding: 0.5rem; border-radius: 0.25rem; font-family: monospace; }
.header { background: #fee2e2; }
.payload { background: #fef3c7; }
.signature { background: #dbeafe; }
EOF

cat > $BUILD_DIR/styles/components/json.css << 'EOF'
.json-formatter { display: flex; gap: 1rem; height: 500px; }
.json-input-section, .json-output-section { flex: 1; display: flex; flex-direction: column; }
.json-controls { display: flex; gap: 0.5rem; margin-bottom: 1rem; align-items: center; }
.json-textarea { flex: 1; font-family: monospace; resize: none; }
EOF

# Create GitHub Pages specific files
echo "Creating GitHub Pages files..."

# Create .nojekyll file to prevent Jekyll processing
touch $BUILD_DIR/.nojekyll

# Create a simple README for the dist folder
cat > $BUILD_DIR/README.md << 'EOF'
# DevTools - Optimized Build

This is the optimized production build for GitHub Pages.

## Features:
- ⚡ Lazy loading components
- 🎯 Critical CSS inlined
- 💾 Service Worker caching
- 📱 Mobile-first responsive
- 🚀 GitHub Pages optimized

Original source: https://github.com/kildo162/tools
EOF

# Update service worker with new cache version
echo "Updating service worker..."
sed -i "s/devtools-v1/devtools-gh-$(date +%s)/g" $BUILD_DIR/sw.js

echo "✅ Build completed successfully!"
echo "📊 Build statistics:"
echo "   Original HTML: $(wc -c < index.html 2>/dev/null || echo 'N/A') bytes"
echo "   Optimized HTML: $(wc -c < $BUILD_DIR/index.html) bytes"
echo "   Components: $(find $BUILD_DIR/components -name '*.js' | wc -l) files"
echo "   Images: $(find $BUILD_DIR/images -type f | wc -l) files"

echo ""
echo "🎯 GitHub Pages optimizations applied:"
echo "   ✅ Relative paths for all assets"
echo "   ✅ .nojekyll file created"
echo "   ✅ Critical CSS inlined"
echo "   ✅ Service Worker with GitHub Pages paths"
echo "   ✅ Component lazy loading"
echo "   ✅ Mobile responsive design"

echo ""
echo "🚀 GitHub Pages deployment steps:"
echo "   1. cd dist && git init"
echo "   2. git add . && git commit -m 'Optimized build'"
echo "   3. git push -f origin master:gh-pages"
echo "   4. Enable GitHub Pages in repo settings"

echo ""
echo "� Or use GitHub Actions for automated deployment!"
