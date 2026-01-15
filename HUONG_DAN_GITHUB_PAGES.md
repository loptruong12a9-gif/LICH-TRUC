# Hướng Dẫn Đưa App Lên GitHub Pages & Dùng Ngoại Tuyến (Offline) Trên iPhone

Chào Tân! Đây là hướng dẫn chi tiết để bạn có thể đưa ứng dụng "Lịch Trực Y Cụ" lên mạng và sử dụng như một ứng dụng thật trên iPhone mà không cần mạng.

## Bước 1: Tạo Repository trên GitHub

1. Truy cập [github.com](https://github.com/) và đăng nhập (nếu chưa có tài khoản, hãy đăng ký).
2. Nhấn nút **New** (màu xanh) để tạo Repository mới.
3. Đặt tên Repo (ví dụ: `lich-truc`).
4. Để chế độ **Public** (Công khai).
5. Nhấn **Create repository**.

## Bước 2: Tải Code lên GitHub

Bạn có thể dùng **GitHub Desktop** (dễ nhất) hoặc **Git CLI**. Nếu dùng GitHub Desktop:

1. Chọn **Set up in Desktop** hoặc tải thủ công các file lên bằng cách kéo thả vào cửa sổ trình duyệt (nếu Repo còn trống, chọn link "uploading an existing file").
2. Kéo thả tất cả các file trong thư mục này vào:
   - `index.html`
   - `style.css`
   - `script.js`
   - `sw.js`
   - `manifest.json`
   - `logo.jpg`
3. Nhập ghi chú (Commit message) là "Initial commit" và nhấn **Commit changes**.

## Bước 3: Kích hoạt GitHub Pages

1. Tại trang Repository trên GitHub, vào mục **Settings** (biểu tượng bánh răng).
2. Chọn menu **Pages** ở cột bên trái.
3. Ở mục **Branch**, chọn `main` (hoặc `master`) và nhấn **Save**.
4. Đợi khoảng 1-2 phút, bạn sẽ thấy link hiện lên dạng: `https://[tên-của-bạn].github.io/[tên-repo]/`. Đây chính là link ứng dụng của bạn!

## Bước 4: Cài đặt lên iPhone để dùng Offline

1. Mở trình duyệt **Safari** trên iPhone.
2. Truy cập vào link GitHub Pages bạn vừa tạo ở Bước 3.
3. Nhấn vào biểu tượng **Chia sẻ** (Share - hình ô vuông có mũi tên lên) ở thanh công cụ phía dưới Safari.
4. Kéo xuống và chọn **Thêm vào màn hình chính** (Add to Home Screen).
5. Nhấn **Thêm** (Add).

## Cách hoạt động Offline

Bây giờ, ứng dụng đã nằm trên màn hình chính như một App thực thụ:
- Ứng dụng đã được thiết lập Service Worker (file `sw.js`) để tự động lưu (cache) các file cần thiết.
- Lần đầu mở app, hãy đảm bảo có mạng để nó tải đủ dữ liệu.
- Từ lần sau, bạn có thể tắt Wi-Fi/4G và mở App từ màn hình chính, lịch trực vẫn sẽ hiện ra và hoạt động bình thường!

> [!TIP]
> **Lưu ý:** Chức năng xem thời tiết yêu cầu mạng để cập nhật dữ liệu mới nhất. Nếu dùng offline, phần thời tiết có thể không hiển thị được thông tin mới nhất.
