#!/usr/bin/env bash
set -euo pipefail

# Build and push Docker image for the host server.
# - Builds frontend (if needed) and syncs to host/ui
# - Builds multi-arch Docker image (amd64, arm64) with buildx if available
# - Tags image as :latest and :<TAG>
# - Pushes to Docker Hub repo khanhnd162/tools (docker login required)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"
HOST_DIR="$REPO_ROOT/host"
HOST_UI_DIR="$HOST_DIR/ui"
IMAGE_REPO="khanhnd162/tools"

# Inputs
TAG_FROM_ARG="${1:-}"

# Resolve TAG: prefer user arg; else use <YYYYmmddHHMMSS>-<gitsha>
TS_TAG="$(date +%Y%m%d%H%M%S)"
if GIT_SHA=$(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null); then
  DEFAULT_TAG="${TS_TAG}-${GIT_SHA}"
else
  DEFAULT_TAG="${TS_TAG}"
fi
TAG="${TAG_FROM_ARG:-$DEFAULT_TAG}"

log() { printf "\033[1;34m[docker]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[warn]\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m[err ]\033[0m %s\n" "$*"; }

log "Image repo: $IMAGE_REPO"
log "Image tag : $TAG"

# 1) Ensure frontend is built and synced to host/ui
if [[ ! -d "$HOST_UI_DIR" || -z "$(ls -A "$HOST_UI_DIR" 2>/dev/null || true)" ]]; then
  log "host/ui is empty or missing. Building frontend..."
  if [[ ! -x "$FRONTEND_DIR/build.sh" ]]; then
    err "Missing frontend/build.sh or not executable."
    exit 1
  fi
  (cd "$FRONTEND_DIR" && bash ./build.sh)
else
  log "host/ui already populated. Skipping frontend build."
fi

# 2) Build and push
if command -v docker >/dev/null 2>&1; then
  if docker buildx version >/dev/null 2>&1; then
    # Ensure a builder exists
    if ! docker buildx inspect multiarch-builder >/dev/null 2>&1; then
      log "Creating buildx builder 'multiarch-builder'..."
      docker buildx create --name multiarch-builder --use >/dev/null
    else
      docker buildx use multiarch-builder >/dev/null
    fi
    log "Building multi-arch image with buildx and pushing..."
    docker buildx build \
      --platform linux/amd64,linux/arm64 \
      -t "$IMAGE_REPO:$TAG" \
      -t "$IMAGE_REPO:latest" \
      -f "$HOST_DIR/Dockerfile" \
      --push \
      "$HOST_DIR"
  else
    warn "docker buildx not found. Building single-arch image with docker build..."
    docker build -t "$IMAGE_REPO:$TAG" -f "$HOST_DIR/Dockerfile" "$HOST_DIR"
    docker tag "$IMAGE_REPO:$TAG" "$IMAGE_REPO:latest"
    log "Pushing images... (requires docker login)"
    docker push "$IMAGE_REPO:$TAG"
    docker push "$IMAGE_REPO:latest"
  fi
else
  err "Docker not installed. Please install Docker and login (docker login) before running."
  exit 1
fi

log "Done. Pushed: $IMAGE_REPO:$TAG and :latest"
