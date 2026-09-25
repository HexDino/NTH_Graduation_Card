# 🎓 Thiệp mời Lễ Tốt Nghiệp – Nguyễn Thanh Hưng

Website thiệp mời tĩnh (HTML + CSS + JS thuần, không cần build). Mở `index.html` là chạy.

```
index.html      – trang thiệp
style.css       – giao diện (bảng màu navy / đỏ / vàng / kem)
script.js       – toàn bộ logic + CONFIG
links.html      – trang tạo link riêng cho từng khách (chỉ bạn dùng)
assets/         – avatar.jpg, soict-logo.png (logo ĐHBK + SOICT), hust-logo.png
music.mp3       – (tuỳ chọn, bạn tự thêm) nhạc nền
```

## 1. Sửa thông tin (CONFIG)
Mở `script.js`, sửa object `CONFIG` ở đầu file:

| Khoá | Ý nghĩa |
|---|---|
| `eventStart` | Giờ bắt đầu, dạng `2026-09-27T09:00:00+07:00`. **Ngày 27/09/2026 lấy theo thiệp của các bạn cùng trường – hãy kiểm tra lại.** |
| `eventEnd` | Giờ kết thúc. Đang để `null` vì chưa biết → lịch dùng `defaultDurationHours` (2 giờ). Khi biết thì điền, ví dụ `"2026-09-27T11:30:00+07:00"`. |
| `venueName`, `venueAddress`, `mapUrl` | Địa điểm & link Google Maps |
| `phone` | Số điện thoại. **Để trống thì nút “Gọi” tự ẩn.** |
| `music` | Tên file nhạc (mặc định `music.mp3`) |
| `defaultGuest` | Tên hiển thị khi link không có `?name=` (mặc định “Bạn”) |
| `defaultSelf` | Cách xưng mặc định (“mình”) |
Thứ, ngày, tháng, giờ trên thiệp và đếm ngược đều tự tính từ `eventStart`. Nút bản đồ trỏ tới `mapUrl`.

Đổi ảnh: thay `assets/avatar.jpg` (nên ~800px). Nếu khuôn mặt bị lệch trong khung, chỉnh `object-position` của `.portrait-frame img` trong `style.css`.

## 2. Thêm nhạc nền
Chép một file nhạc bạn có quyền sử dụng vào cùng thư mục với `index.html`, đặt tên `music.mp3` (hoặc đổi `CONFIG.music`).
Nhạc bắt đầu khi khách bấm “Mở thiệp”. Nút đĩa nhạc ở góc phải dưới để bật/tắt. Không có file thì nút tự ẩn.

## 3. Link riêng cho từng khách
Thêm `?name=` vào cuối link (tiếng Việt có dấu phải được mã hoá URL):
```
https://ten-ban.github.io/thiep-moi/?name=Th%E1%BA%A7y%20H%C6%B0ng
https://ten-ban.github.io/thiep-moi/?name=Th%E1%BA%A7y%20H%C6%B0ng&xung=em   ← lời mời xưng "em"
```
Cách dễ nhất: mở `links.html` (ví dụ `https://ten-ban.github.io/thiep-moi/links.html`), dán URL thiệp, dán danh sách tên (mỗi dòng một người, có thể thêm `| em` hoặc `| con` để đổi cách xưng), bấm **Tạo link**. Sau đó sao chép từng link/tin nhắn mẫu hoặc tải CSV.

## 4. Chạy thử trên máy
```
cd thu-muc-thiep
python -m http.server 8000
```
Mở http://localhost:8000/?name=Test

## 5. Deploy miễn phí
**GitHub Pages**
1. Tạo repo mới (ví dụ `thiep-moi`), upload toàn bộ file (index.html phải ở thư mục gốc).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. Sau 1–2 phút thiệp có ở `https://<username>.github.io/thiep-moi/`.

**Vercel**
1. vercel.com → Add New → Project → Import repo trên.
2. Framework Preset: *Other*, không cần Build Command → Deploy.

## 6. Tính năng nhỏ
- Intro dạng terminal (chạm để tua nhanh, “Bỏ qua”, phím Esc/Enter).
- Mở thiệp: pháo giấy vàng + mũ tốt nghiệp bay lên.
- Thiệp nghiêng 3D theo chuột (máy tính) hoặc theo độ nghiêng điện thoại (iPhone sẽ hỏi quyền đúng lúc bấm “Mở thiệp”; từ chối thì thiệp vẫn hiển thị bình thường).
- Đếm ngược theo giờ Việt Nam → “đang diễn ra” → lời cảm ơn sau buổi lễ.
- Easter egg: chạm chiếc mũ ở góc thiệp 5 lần (hoặc gõ Konami code ↑↑↓↓←→←→BA).
- Tự tắt hiệu ứng khi máy bật “Giảm chuyển động”.
