#!/bin/bash

# Fix absolute resource paths in the built files
echo "🔧 Fixing resource paths in HTML files..."

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ dist/ directory not found! Run build.sh first."
    exit 1
fi

# Process HTML files
find dist -name "*.html" -type f -exec sed -i 's|href="/|href="./|g' {} \;
find dist -name "*.html" -type f -exec sed -i 's|src="/|src="./|g' {} \;

# Process CSS files
find dist -name "*.css" -type f -exec sed -i 's|url(/|url(../|g' {} \;

# Process JavaScript files that might reference resources
find dist -name "*.js" -type f -exec sed -i 's|"/images/|"./images/|g' {} \;
find dist -name "*.js" -type f -exec sed -i 's|"/styles/|"./styles/|g' {} \;
find dist -name "*.js" -type f -exec sed -i 's|"/js/|"./js/|g' {} \;
find dist -name "*.js" -type f -exec sed -i 's|"/components/|"./components/|g' {} \;

echo "✅ Resource paths fixed for GitHub Pages deployment"
echo ""
echo "📊 Path fixes applied to:"
echo "   HTML files: $(find dist -name "*.html" | wc -l)"
echo "   CSS files: $(find dist -name "*.css" | wc -l)"
echo "   JS files: $(find dist -name "*.js" | wc -l)"

echo ""
echo "🚀 Ready for deployment! Build files are now using relative paths."
