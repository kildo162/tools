# 📸 Tạo Open Graph Image Cho DevTools

## ✅ Files đã tạo sẵn:

1. **`og-image-template.svg`** - Template SVG vector (chỉnh sửa được)
2. **`og-image-generator.html`** - Template HTML để screenshot (nhanh nhất)
3. **`generate_og_image.sh`** - Script tự động (cần ImageMagick)
4. **`CREATE_OG_IMAGE_GUIDE.md`** - Hướng dẫn chi tiết

## 🚀 Cách nhanh nhất (Khuyến nghị):

### Bước 1: Mở file HTML
```bash
# Mở file trong trình duyệt
open og-image-generator.html
# Hoặc
firefox og-image-generator.html
# Hoặc
google-chrome og-image-generator.html
```

### Bước 2: Screenshot
1. **Cách 1 - Browser DevTools:**
   - F12 để mở DevTools
   - Right-click vào `<div class="og-image">`
   - Chọn "Capture node screenshot"
   - Lưu thành `og-image.png`

2. **Cách 2 - Manual Screenshot:**
   - Screenshot phần ảnh 1200x630px
   - Crop chính xác kích thước

### Bước 3: Đặt file đúng vị trí
```bash
# Tạo thư mục nếu chưa có
mkdir -p images

# Di chuyển file
mv og-image.png images/
```

## 🎨 Thông số kỹ thuật:
- **Size**: 1200x630px (tỷ lệ 1.91:1)
- **Format**: PNG
- **Max size**: 300KB
- **URL**: https://tools.khanhnd.com/images/og-image.png

## 🔧 Các tùy chọn khác:

### Canva (Web-based, miễn phí):
1. Truy cập canva.com
2. Tạo "Facebook Post" (1200x630px) 
3. Design theo template
4. Download PNG

### Figma (Chuyên nghiệp):
1. Tạo frame 1200x630px
2. Copy design từ file HTML
3. Export PNG

### Online Tools:
- [Meta Tags Generator](https://metatags.io)
- [Social Image Generator](https://www.bannerbear.com)

## ✅ Checklist sau khi tạo:
- [ ] File có đúng kích thước 1200x630px
- [ ] Dung lượng < 300KB
- [ ] Đặt tại `/images/og-image.png`
- [ ] Test tại [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test tại [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Commit và push lên GitHub

## 🚀 Deploy:
```bash
git add images/og-image.png
git commit -m "Add Open Graph image for social media sharing"
git push origin master
```

**URL final**: https://tools.khanhnd.com/images/og-image.png
