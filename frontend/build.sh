#!/usr/bin/env bash
set -euo pipefail

# Build optimized frontend into dist/ and sync to host/ui for docker packaging.
# Repo layout:
# - frontend/ (this script runs here)
# - host/ (Go static file server + Dockerfile)

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$ROOT_DIR"
DIST_DIR="$FRONTEND_DIR/dist"
HOST_DIR="$ROOT_DIR/../host"
HOST_UI_DIR="$HOST_DIR/ui"

# Utility
log() { printf "\033[1;34m[build]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[warn]\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m[err ]\033[0m %s\n" "$*"; }

log "Starting frontend build..."

# 1) Clean dist
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# 2) Copy static assets and pages
log "Copying static files and pages..."
# HTML pages
cp -v "$FRONTEND_DIR"/index.html "$DIST_DIR/" || true
cp -v "$FRONTEND_DIR"/contact.html "$DIST_DIR/" || true
cp -v "$FRONTEND_DIR"/cookie-policy.html "$DIST_DIR/" || true
cp -v "$FRONTEND_DIR"/donate.html "$DIST_DIR/" || true
cp -v "$FRONTEND_DIR"/faq.html "$DIST_DIR/" || true
cp -v "$FRONTEND_DIR"/privacy-policy.html "$DIST_DIR/" || true
cp -v "$FRONTEND_DIR"/support.html "$DIST_DIR/" || true
cp -v "$FRONTEND_DIR"/terms-of-service.html "$DIST_DIR/" || true
cp -v "$FRONTEND_DIR"/AffiliateBanners.html "$DIST_DIR/" || true

# Root-level config files
cp -v "$FRONTEND_DIR"/robots.txt "$DIST_DIR/" || true
cp -v "$FRONTEND_DIR"/sitemap.xml "$DIST_DIR/" || true
cp -v "$FRONTEND_DIR"/site.webmanifest "$DIST_DIR/" || true
# Optional: CNAME if present
if [[ -f "$FRONTEND_DIR/CNAME" ]]; then cp -v "$FRONTEND_DIR/CNAME" "$DIST_DIR/"; fi

# 3) Copy directories (components, js, images, styles, css)
log "Copying directories..."
mkdir -p "$DIST_DIR/components" "$DIST_DIR/js" "$DIST_DIR/images" "$DIST_DIR/styles" "$DIST_DIR/css"

# components
if [[ -d "$FRONTEND_DIR/components" ]]; then
  cp -vr "$FRONTEND_DIR/components/"* "$DIST_DIR/components/" || true
fi

# js (preserve structure)
if [[ -d "$FRONTEND_DIR/js" ]]; then
  cp -vr "$FRONTEND_DIR/js" "$DIST_DIR/" || true
fi

# images
if [[ -d "$FRONTEND_DIR/images" ]]; then
  cp -vr "$FRONTEND_DIR/images" "$DIST_DIR/" || true
fi

# css/critical.css
if [[ -d "$FRONTEND_DIR/css" ]]; then
  cp -vr "$FRONTEND_DIR/css" "$DIST_DIR/" || true
fi

# styles.css + styles/
if [[ -f "$FRONTEND_DIR/styles.css" ]]; then
  cp -v "$FRONTEND_DIR/styles.css" "$DIST_DIR/" || true
fi
if [[ -d "$FRONTEND_DIR/styles" ]]; then
  cp -vr "$FRONTEND_DIR/styles" "$DIST_DIR/" || true
fi

# 4) Service worker: bump cache version and copy
if [[ -f "$FRONTEND_DIR/sw.js" ]]; then
  log "Updating service worker cache version..."
  TS="$(date +%Y%m%d%H%M%S)"
  # Replace CACHE_NAME like: const CACHE_NAME = 'devtools-vXXXX'; (safer regex)
  sed -E "s|(const CACHE_NAME = '[A-Za-z0-9_-]+-v)[^']+';|\\1$TS';|" "$FRONTEND_DIR/sw.js" > "$DIST_DIR/sw.js" || cp -v "$FRONTEND_DIR/sw.js" "$DIST_DIR/sw.js"
else
  warn "sw.js not found; skipping service worker copy."
fi

# 5) Write .nojekyll and README
printf "Static build for DevTools (SPA). Built at %s\n" "$(date -u)" > "$DIST_DIR/README.md"
touch "$DIST_DIR/.nojekyll"

# 6) Basic path fix-ups (optional, noop if patterns absent)
# Example: ensure critical.css path consistency in HTML files
log "Fixing common paths in HTML (if needed)..."
find "$DIST_DIR" -maxdepth 1 -name "*.html" -print0 | while IFS= read -r -d '' f; do
  sed -i "s|href=\"/css/|href=\"./css/|g" "$f" || true
  sed -i "s|href=\"/styles|href=\"./styles|g" "$f" || true
  sed -i "s|src=\"/js/|src=\"./js/|g" "$f" || true
  sed -i "s|src=\"/components/|src=\"./components/|g" "$f" || true
  sed -i "s|href=\"/images/|href=\"./images/|g" "$f" || true
  sed -i "s|src=\"/images/|src=\"./images/|g" "$f" || true
done

# 7) Sync dist to host/ui
log "Syncing dist -> host/ui..."
mkdir -p "$HOST_UI_DIR"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$DIST_DIR/" "$HOST_UI_DIR/"
else
  warn "rsync not found, falling back to cp"
  rm -rf "$HOST_UI_DIR"/*
  cp -a "$DIST_DIR/." "$HOST_UI_DIR/"
fi

# 8) Summary
log "Build complete. Summary:"
log "- Frontend dist: $DIST_DIR"
log "- Host UI sync: $HOST_UI_DIR"

# 9) Show a few files
ls -alh "$DIST_DIR" | sed -n '1,50p' || true
