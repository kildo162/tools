# 🚀 GitHub Pages Deployment Guide

## 📋 Cách Deploy DevTools lên GitHub Pages

### Phương pháp 1: GitHub Actions (Khuyến nghị) ⭐

1. **Kích hoạt GitHub Actions:**
   - Push code lên GitHub repository (branch `master` hoặc `main`)
   - GitHub Actions sẽ tự động build và deploy

2. **Các bước GitHub Actions thực hiện:**
   ```yaml
   # Checkout code
   ↓
   # Setup Node.js 20 & cache dependencies
   ↓
   # Install npm dependencies
   ↓
   # Setup GitHub Pages
   ↓
   # Validate build scripts
   ↓
   # Build optimized version
   ↓
   # Fix resource paths
   ↓
   # Upload & Deploy
   ```

3. **Tính năng mới của workflow:**
   - ✨ Tự động chạy khi push hoặc manual trigger
   - 🔒 Security permissions được giới hạn chính xác
   - ⚡ Concurrent deployment control
   - 🕒 Timeout protection (15 phút cho build, 10 phút cho deploy)
   - ✅ Validation steps cho build scripts và output
   - 📦 NPM dependencies caching
   - 🔄 Tự động fix resource paths
   - 🚦 Deployment status verification

4. **Cấu hình GitHub Pages:**
   ```
   Repository → Settings → Pages
   Source: GitHub Actions
   ```

### Phương pháp 2: Manual Deploy 🔧

[Nội dung phương pháp manual giữ nguyên như cũ]

### 📊 Kiểm tra Performance

[Nội dung performance check giữ nguyên như cũ]

### 🔧 GitHub Pages Specific Optimizations

[Nội dung optimizations giữ nguyên như cũ]

### 🚀 Performance Benefits

[Nội dung performance benefits giữ nguyên như cũ]

### 🛠️ Troubleshooting

**Lỗi thường gặp:**

1. **GitHub Actions không chạy:**
   - Kiểm tra file `.github/workflows/deploy.yml` tồn tại
   - Verify branch name là `master` hoặc `main`
   - Check repository permissions

2. **Build thất bại:**
   - Verify `build.sh` và `fix-paths.sh` có quyền execute
   - Check npm dependencies đã install
   - Xem build logs trong Actions tab

3. **Deploy thất bại:**
   - Verify GitHub Pages đã enable
   - Check GitHub Actions có đủ permissions
   - Verify `CNAME` file configuration

[Phần còn lại giữ nguyên như cũ]
