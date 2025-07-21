#!/bin/bash

# Fix resource paths in source files
echo "🔧 Fixing resource paths in source HTML files..."

# Process HTML files
find . -name "*.html" -type f -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i 's|href="/|href="./|g' {} \;
find . -name "*.html" -type f -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i 's|src="/|src="./|g' {} \;

# Process CSS files that might reference external resources
find . -name "*.css" -type f -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i 's|url(/|url(../|g' {} \;

# Process JavaScript files that might reference resources
find . -name "*.js" -type f -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i 's|"/images/|"./images/|g' {} \;
find . -name "*.js" -type f -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i 's|"/styles/|"./styles/|g' {} \;
find . -name "*.js" -type f -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i 's|"/js/|"./js/|g' {} \;
find . -name "*.js" -type f -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i 's|"/components/|"./components/|g' {} \;

echo "✅ Source file paths updated to use relative paths"
echo ""
echo "📊 Path fixes applied to:"
echo "   HTML files: $(find . -name "*.html" -type f -not -path "./dist/*" -not -path "./node_modules/*" | wc -l)"
echo "   CSS files: $(find . -name "*.css" -type f -not -path "./dist/*" -not -path "./node_modules/*" | wc -l)"
echo "   JS files: $(find . -name "*.js" -type f -not -path "./dist/*" -not -path "./node_modules/*" | wc -l)"

echo ""
echo "🚀 Source files updated with relative paths!"
