#!/bin/bash

# Simple deploy script for GitHub Pages
set -e

echo "🚀 Deploying to GitHub Pages..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: Build directory 'dist' not found"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📋 Current branch: $CURRENT_BRANCH"

# Stage and commit changes to current branch first
echo "💾 Committing changes to $CURRENT_BRANCH..."
git add .
git commit -m "Build for deployment $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

# Push to origin
echo "⬆️ Pushing to origin/$CURRENT_BRANCH..."
git push origin $CURRENT_BRANCH

echo ""
echo "✅ Deploy completed!"
echo "🌐 GitHub Actions will automatically build and deploy to GitHub Pages"
echo "📍 Your site will be available at: https://kildo162.github.io/tools"
echo "📄 All HTML pages will be accessible:"
echo "   • https://kildo162.github.io/tools/"
echo "   • https://kildo162.github.io/tools/contact.html"
echo "   • https://kildo162.github.io/tools/faq.html"
echo "   • https://kildo162.github.io/tools/support.html"
echo "   • https://kildo162.github.io/tools/donate.html"
echo "   • https://kildo162.github.io/tools/privacy-policy.html"
echo "   • https://kildo162.github.io/tools/terms-of-service.html"
echo "   • https://kildo162.github.io/tools/cookie-policy.html"
echo ""
echo "🔍 To check deployment status:"
echo "   Visit: https://github.com/kildo162/tools/actions"
echo ""
echo "⚡ If this is your first deployment, make sure GitHub Pages is enabled:"
echo "   1. Go to repository Settings > Pages"
echo "   2. Select 'GitHub Actions' as source"
echo "   3. Save the settings"
