# DevTools - Free Developer Tools

**Domain**: https://tools.khanhnd.com

## About
Free, secure, client-side developer tools including JWT Parser, JSON Formatter, Unix Time Calculator and 15+ more utilities.

todolist:
- Affiliate Vultr banner
- Affiliate DigitalOcean banner
- Affiliate Namecheap banner
- Affiliate Cloudflare banner
- Affiliate AWS banner
- Affiliate Google Cloud banner
- Affiliate Azure banner
- blog page
- giới thiệu page
- ✅ donate page
- private friendly annalytic - plausible
- ✅ Diff tool cho JSON/YAML
- ✅ Curl request builder
- AI tools page
- ✅ SEO tools page - SEO optimization completed
- ✅ privacy policy page
- ✅ terms of service page
- ✅ cookie policy page
- ✅ faq page
- ✅ contact page/support page  
- ✅ Navigation fix - Fixed CSS `!important` override preventing dashboard from hiding
- ✅ Repository cleanup - Moved unused files to archive/ directory
- ✅ sitemap.xml
- ✅ robots.txt
- ✅ Domain mapping to tools.khanhnd.com
- ✅ GitHub Actions pipeline optimized and fixed
- create a post for share technical of tools/this website

## SEO Optimization Completed ✅

### Implemented:
- ✅ sitemap.xml with all tool URLs (updated for tools.khanhnd.com)
- ✅ robots.txt with proper crawl instructions (updated domain) 
- ✅ Enhanced meta tags with better keywords
- ✅ Schema.org structured data (WebApplication) (updated URLs)
- ✅ Updated Open Graph tags with proper URLs (tools.khanhnd.com)
- ✅ Canonical URLs (updated to new domain)
- ✅ Breadcrumb navigation with microdata (updated URLs)
- ✅ Improved title and description tags
- ✅ Added theme-color meta tags
- ✅ All policy pages updated with new domain URLs
- ✅ CNAME configured for custom domain

### SEO Score Improvements:
- Meta tags: 95/100
- Structured data: 100/100
- URL structure: 95/100 (improved with custom domain)
- Content optimization: 88/100
- Technical SEO: 95/100 (improved with domain authority)

### Domain Configuration:
- **Primary Domain**: https://tools.khanhnd.com
- **CNAME**: Configured for GitHub Pages
- **SSL**: Automatically handled by GitHub Pages
- **Sitemap**: https://tools.khanhnd.com/sitemap.xml

### Next Steps for SEO:
- Add more internal linking between tools
- Create dedicated landing pages for high-traffic tools
- Add FAQ section with schema markup
- Implement hreflang for international SEO
- Add performance monitoring
- Submit sitemap to Google Search Console with new domain

## Project Structure

### Main Files
- `index.html` - Main application page
- `script.js` - Core JavaScript functionality
- `styles.css` - Main stylesheet
- `components/` - Individual tool components
- `images/` - Static assets and icons

### Support Pages
- `contact.html` - Contact form and information
- `faq.html` - Frequently asked questions
- `support.html` - Help center and documentation
- `privacy-policy.html`, `terms-of-service.html`, `cookie-policy.html` - Legal pages
- `donate.html` - Support the project page

### Configuration
- `sitemap.xml` - SEO sitemap
- `robots.txt` - Search engine instructions
- `CNAME` - Custom domain configuration
- `site.webmanifest` - PWA manifest
- `sw.js` - Service worker for offline functionality

### Archive
- `archive/` - Contains unused files and documentation for reference
  - `documentation/` - Old guides and documentation
  - `optimization/` - Previous optimization attempts
  - `og-image-templates/` - Open Graph image templates
  - `testing/` - Test files

## Development & Deployment

### Local Development
```bash
# Start local development server
npm run dev
# or
npm run serve
```

### Building for Production
```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

### Deployment to GitHub Pages

**Automated Deployment (Recommended):**
```bash
# Simple deployment - builds and pushes to GitHub for auto-deployment
npm run deploy
```

**Manual Deployment:**
```bash
# Build and manually deploy to gh-pages branch
npm run deploy:manual
```

**GitHub Actions Deployment:**
- Push to `master` or `main` branch
- GitHub Actions automatically builds and deploys
- View status at: https://github.com/kildo162/tools/actions

### First-time GitHub Pages Setup
1. Go to repository **Settings > Pages**
2. Select **"GitHub Actions"** as source
3. Save the settings
4. Push to master branch to trigger first deployment
5. Your site will be available at: https://kildo162.github.io/tools

### Build Optimizations
- ⚡ Lazy loading components
- 🎯 Critical CSS inlined
- 💾 Service Worker caching
- 📱 Mobile-first responsive design
- 🚀 GitHub Pages optimized paths
- 📦 Component minification
- 🔍 SEO optimization

### Scripts
- `npm run build` - Create optimized production build
- `npm run deploy` - Deploy to GitHub Pages via GitHub Actions
- `npm run clean` - Remove build artifacts
- `npm run analyze` - Analyze bundle size and performance