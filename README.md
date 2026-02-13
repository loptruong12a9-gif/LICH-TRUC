# 📅 Lịch Trực Y Cụ - BV Hồng Đức III

> Ứng dụng quản lý lịch trực y cụ chuyên nghiệp cho Khoa PT-GMHS

[![Version](https://img.shields.io/badge/version-6.0.0-blue.svg)](https://github.com/yourusername/lich-truc)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

## ✨ Tính năng

- 🎯 **Quản lý lịch trực tự động** - Thuật toán phân chia công bằng
- 📱 **Progressive Web App** - Cài đặt như app native trên iOS/Android
- ☁️ **Đồng bộ GitHub** - Lưu trữ dữ liệu trên cloud
- 📊 **Xuất báo cáo** - Export Excel, Word, PDF chuyên nghiệp
- 🌙 **Offline Mode** - Hoạt động không cần internet
- 🎨 **UI Premium** - Thiết kế hiện đại với Glassmorphism

## 🚀 Deployment

### Option 1: GitHub Pages (Khuyến nghị)

1. **Fork hoặc Clone repository**
   ```bash
   git clone https://github.com/yourusername/lich-truc.git
   cd lich-truc
   ```

2. **Push lên GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Kích hoạt GitHub Pages**
   - Vào **Settings** → **Pages**
   - Source: chọn `main` branch
   - Folder: chọn `/ (root)`
   - Click **Save**

4. **Truy cập ứng dụng**
   ```
   https://yourusername.github.io/lich-truc/
   ```

### Option 2: Netlify (Miễn phí)

1. **Đăng nhập Netlify**
   - Truy cập [netlify.com](https://netlify.com)
   - Đăng nhập bằng GitHub

2. **Deploy**
   - Click **New site from Git**
   - Chọn repository
   - Build settings: để trống (static site)
   - Click **Deploy site**

3. **Custom Domain (Tùy chọn)**
   - Domain settings → Add custom domain

### Option 3: Vercel (Miễn phí)

```bash
npm install -g vercel
vercel --prod
```

### Option 4: Self-hosted (Server riêng)

1. **Upload files lên server**
   ```bash
   scp -r * user@yourserver.com:/var/www/html/lich-truc/
   ```

2. **Cấu hình Nginx**
   ```nginx
   server {
       listen 80;
       server_name lich-truc.yourdomain.com;
       root /var/www/html/lich-truc;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **SSL với Let's Encrypt**
   ```bash
   sudo certbot --nginx -d lich-truc.yourdomain.com
   ```

## 📱 Cài đặt PWA

### iOS (iPhone/iPad)

1. Mở Safari → Truy cập URL ứng dụng
2. Nhấn nút **Share** (biểu tượng mũi tên)
3. Chọn **Add to Home Screen**
4. Đặt tên và nhấn **Add**

### Android

1. Mở Chrome → Truy cập URL ứng dụng
2. Nhấn menu (3 chấm) → **Add to Home screen**
3. Hoặc nhấn banner "Install App" xuất hiện tự động

## ⚙️ Cấu hình

### GitHub Sync (Tùy chọn)

1. **Tạo GitHub Personal Access Token**
   - GitHub → Settings → Developer settings → Personal access tokens
   - Chọn **Generate new token (classic)**
   - Quyền cần: `repo` (Full control of private repositories)

2. **Cấu hình trong app**
   - Mở app → Sidebar → **☁️ Đồng bộ GitHub**
   - Nhập Token, User/Repo, và tên file (VD: `data.json`)
   - Click **Lưu Cấu Hình**

### Tùy chỉnh

Chỉnh sửa các file sau:

- `style.css` - Màu sắc, font chữ
- `script.js` - Logic nghiệp vụ
- `manifest.json` - Tên app, icons
- `logo.jpg` - Logo của bạn

## 🛠️ Development

### Yêu cầu

- Trình duyệt hiện đại (Chrome, Safari, Firefox)
- Text editor (VS Code khuyến nghị)

### Chạy local

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server

# Option 3: VS Code Live Server
# Install extension "Live Server" và click "Go Live"
```

Truy cập: `http://localhost:8000`

### Build Production (Tùy chọn)

Minify CSS/JS để giảm dung lượng:

```bash
# Cài đặt tools
npm install -g csso-cli uglify-js

# Minify CSS
csso style.css -o style.min.css

# Minify JS
uglifyjs script.js -o script.min.js -c -m

# Cập nhật index.html để dùng file .min
```

## 📊 Cấu trúc thư mục

```
lich-truc/
├── index.html          # Trang chính
├── style.css           # Styles
├── script.js           # Logic
├── sw.js              # Service Worker (PWA)
├── manifest.json      # PWA Manifest
├── logo.jpg           # Logo/Icon
├── README.md          # Tài liệu này
└── BACKUP/            # Backup files
```

## 🔧 Troubleshooting

### PWA không cài đặt được

- Đảm bảo HTTPS (GitHub Pages tự động có SSL)
- Kiểm tra `manifest.json` hợp lệ
- Clear cache và thử lại

### Service Worker không update

```javascript
// Trong Console (F12)
navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
        registration.unregister();
    }
});
// Reload trang
```

### GitHub Sync lỗi

- Kiểm tra Token còn hạn
- Đảm bảo repo tồn tại và có quyền truy cập
- Kiểm tra tên file đúng format (VD: `data.json`)

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 👨‍💻 Phát triển bởi

**Tân Nguyễn**  
📞 036.728.7102  
💬 "Code một lần - Dùng một đời"

---

⭐ Nếu thấy hữu ích, hãy star repo này nhé!
