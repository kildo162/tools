#!/bin/bash

# Local test script for sidebar CSS
set -e

echo "🧪 Testing Sidebar CSS locally..."

# Build first
echo "📦 Building project..."
npm run build

# Check if sidebar.css exists in dist
if [ ! -f "dist/css/sidebar.css" ]; then
    echo "❌ Error: sidebar.css not found in dist/css/"
    exit 1
fi

echo "✅ sidebar.css found in dist/css/"

# Check if HTML files include sidebar.css
echo "🔍 Checking CSS includes in HTML files..."
for html_file in dist/*.html; do
    if [ -f "$html_file" ]; then
        filename=$(basename "$html_file")
        if grep -q "css/sidebar.css" "$html_file"; then
            echo "  ✅ $filename includes sidebar.css"
        else
            echo "  ❌ $filename missing sidebar.css"
        fi
    fi
done

echo ""
echo "📊 Sidebar CSS stats:"
echo "  Size: $(wc -c < dist/css/sidebar.css) bytes"
echo "  Lines: $(wc -l < dist/css/sidebar.css) lines"

echo ""
echo "🌐 Starting local server to test..."
echo "📍 Open: http://localhost:8888"
echo "Press Ctrl+C to stop the server"

cd dist && python -m http.server 8888
