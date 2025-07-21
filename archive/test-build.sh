#!/bin/bash

# Local development testing script
echo "🧪 Testing DevTools build locally..."

# Check if build.sh exists and is executable
if [ ! -f "build.sh" ]; then
    echo "❌ build.sh not found!"
    exit 1
fi

if [ ! -x "build.sh" ]; then
    echo "🔧 Making build.sh executable..."
    chmod +x build.sh
fi

# Run build
echo "🚀 Running build..."
./build.sh

# Validate build
echo "🔍 Validating build..."
if [ -d "dist" ]; then
    echo "✅ dist/ directory created"
    
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html present ($(wc -c < dist/index.html) bytes)"
    else
        echo "❌ index.html missing!"
    fi
    
    if [ -f "dist/.nojekyll" ]; then
        echo "✅ .nojekyll present"
    else
        echo "❌ .nojekyll missing!"
    fi
    
    if [ -f "dist/CNAME" ]; then
        echo "✅ CNAME present: $(cat dist/CNAME)"
    else
        echo "⚠️ CNAME missing (custom domain won't work)"
    fi
    
    echo ""
    echo "📊 Build statistics:"
    echo "   Total size: $(du -sh dist/ | cut -f1)"
    echo "   Files: $(find dist/ -type f | wc -l)"
    echo "   Components: $(find dist/components/ -name '*.js' 2>/dev/null | wc -l)"
    
    echo ""
    echo "🌐 Test locally:"
    echo "   cd dist && python -m http.server 8000"
    echo "   Then visit: http://localhost:8000"
    
else
    echo "❌ dist/ directory not created!"
    exit 1
fi

echo ""
echo "✅ Local build test completed!"
