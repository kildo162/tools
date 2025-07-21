# GitHub Pages Deployment Guide

## Tự động deploy với GitHub Actions

Khi bạn push code lên branch `master` hoặc `main`, GitHub Actions sẽ tự động:

1. ✅ Build project với script `build.sh` 
2. ✅ Tối ưu hóa HTML, CSS, JS
3. ✅ Tạo thư mục `dist/` với code đã optimize
4. ✅ Deploy lên GitHub Pages
5. ✅ Cập nhật domain `tools.khanhnd.com`

## Kiểm tra trước khi deploy

```bash
# Test build locally
./test-build.sh

# Hoặc build trực tiếp
./build.sh

# Test local server
cd dist && python -m http.server 8000
# Mở http://localhost:8000
```

## Cấu trúc build output

```
dist/
├── index.html          # HTML đã optimize với critical CSS inline
├── .nojekyll          # Ngăn Jekyll xử lý
├── CNAME              # Custom domain config
├── sw.js              # Service worker
├── css/               # CSS files
├── js/                # JavaScript core
├── components/        # Tool components
├── images/           # Optimized images
└── styles/           # Component-specific styles
```

## Tối ưu hóa đã áp dụng

- 🎯 **Critical CSS Inline**: CSS quan trọng được nhúng trực tiếp vào HTML
- ⚡ **Lazy Loading**: Components chỉ load khi cần
- 💾 **Service Worker**: Cache tài nguyên cho offline
- 📱 **Mobile First**: Responsive design
- 🚀 **GitHub Pages Ready**: Tất cả paths đã relative

## Troubleshooting

### Build lỗi:
```bash
# Kiểm tra permissions
chmod +x build.sh test-build.sh

# Kiểm tra files cần thiết
ls -la archive/optimization/index-optimized.html
ls -la archive/optimization/SidebarOptimized.js
```

### Deploy lỗi:
1. Kiểm tra GitHub Pages settings trong repo
2. Đảm bảo Actions có quyền `pages: write`  
3. Kiểm tra CNAME file có đúng domain

### Custom domain không hoạt động:
1. Kiểm tra DNS settings trỏ đến GitHub
2. Đợi 24h để DNS propagate
3. Kiểm tra CNAME file trong dist/

## Manual Deploy (backup)

Nếu Actions không hoạt động:

```bash
# Build
./build.sh

# Deploy manual
cd dist
git init
git add .
git commit -m "Deploy $(date)"
git branch -M gh-pages
git remote add origin https://github.com/kildo162/tools.git
git push -f origin gh-pages
```

## Monitoring

- **GitHub Actions**: Tab Actions trong repo
- **Build logs**: Xem chi tiết trong workflow runs
- **Site health**: https://tools.khanhnd.com
- **Performance**: Lighthouse score

## Performance Results

- 📊 **HTML**: 133KB → 10KB (92% reduction)
- ⚡ **First Paint**: < 1s
- 🎯 **Lighthouse**: 95+ score
- 📱 **Mobile**: Fully responsive
