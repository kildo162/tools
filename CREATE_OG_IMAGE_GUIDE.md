# 🎨 Hướng dẫn tạo Open Graph Image cho DevTools

## 📋 Thông số kỹ thuật
- **Kích thước**: 1200x630px (tỷ lệ 1.91:1)
- **Format**: PNG hoặc JPG
- **Dung lượng**: < 300KB
- **Đường dẫn**: `/images/og-image.png`
- **URL đầy đủ**: `https://tools.khanhnd.com/images/og-image.png`

## 🛠️ Các cách tạo ảnh

### Phương án 1: Sử dụng SVG Template (Khuyến nghị)
1. Mở file `og-image-template.svg` bằng:
   - Adobe Illustrator
   - Inkscape (miễn phí)
   - Figma (web-based)
   - Canva (web-based)

2. Tùy chỉnh:
   - Thay logo placeholder bằng logo thật
   - Điều chỉnh màu sắc theo brand
   - Cập nhật text nếu cần

3. Export thành PNG 1200x630px

### Phương án 2: Sử dụng Canva (Nhanh nhất)
1. Truy cập [Canva.com](https://canva.com)
2. Tạo design mới với kích thước 1200x630px
3. Sử dụng template "Social Media" → "Facebook Post"
4. Thiết kế với thông tin:

```
Title: DevTools
Subtitle: Free Developer Tools
Domain: tools.khanhnd.com
Tools: JWT Parser, JSON Formatter, Curl Builder, Hash Generator, UUID Generator
Features: 100% Client-Side, 15+ Tools, Free Forever
```

### Phương án 3: Sử dụng Figma (Chuyên nghiệp)
1. Tạo frame 1200x630px
2. Thêm gradient background: `#667eea` → `#764ba2`
3. Thêm card nền trắng với border-radius
4. Layout như template SVG

### Phương án 4: Tool tự động (AI)
Sử dụng các tool online:
- [Meta Tags](https://metatags.io/) - có OG image generator
- [Social Image Generator](https://www.bannerbear.com/)
- [Pablo by Buffer](https://pablo.buffer.com/)

## 🎨 Design Guidelines

### Màu sắc chính
```css
Primary Blue: #3b82f6
Secondary Purple: #764ba2
Background Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Text Dark: #2d3748
Text Light: #718096
White: #ffffff
Success Green: #10b981
```

### Typography
- Font chính: **Inter** (fallback: Arial, sans-serif)
- Title: 48px, bold
- Subtitle: 24px, medium
- Domain: 20px, regular
- Tool names: 14px, medium
- Descriptions: 12px, regular

### Layout Structure
```
┌─────────────────────────────────────────────┐
│  🛠️ DevTools                               │
│     Free Developer Tools                    │
│     tools.khanhnd.com                      │
│                                             │
│  Popular Tools:                             │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐   │
│  │🔐 JWT │ │📄JSON│ │🚀Curl│ │🔒Hash│   │
│  └───────┘ └───────┘ └───────┘ └───────┘   │
│                                             │
│  🔒 100% Client-Side  ⚡ 15+ Tools  💎 Free│
└─────────────────────────────────────────────┘
```

## 📱 Testing

Sau khi tạo xong, test ảnh tại:
1. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. [Twitter Card Validator](https://cards-dev.twitter.com/validator)
3. [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## 🚀 Deployment

1. Lưu file thành `og-image.png`
2. Upload vào thư mục `/images/`
3. Commit và push lên GitHub
4. Verify tại `https://tools.khanhnd.com/images/og-image.png`

## 💡 Tips

1. **Contrast**: Đảm bảo text có độ tương phản tốt với background
2. **Mobile preview**: Test preview trên mobile social apps
3. **File size**: Optimize để < 300KB bằng TinyPNG
4. **Safe area**: Giữ content quan trọng trong vùng 1200x600px (tránh bị crop)

## 🔧 Quick HTML để test local

```html
<!DOCTYPE html>
<html>
<head>
    <meta property="og:image" content="https://tools.khanhnd.com/images/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <title>Test OG Image</title>
</head>
<body>
    <img src="https://tools.khanhnd.com/images/og-image.png" style="max-width: 600px;">
</body>
</html>
```

## 📞 Hỗ trợ

Nếu cần hỗ trợ tạo ảnh, có thể:
1. Sử dụng template SVG đã tạo
2. Thuê designer trên Fiverr (~$5-15)
3. Dùng AI tools như Canva Magic Design
4. Copy design từ các trang tương tự

**Lưu ý**: File `og-image-template.svg` đã được tạo sẵn và có thể dùng trực tiếp!
