# L'Amour - Website Thiệp Cưới Online Cao Cấp (Luxury Wedding Invitation)

Website thiệp cưới trực tuyến sang trọng, lãng mạn, hiện đại, tối ưu 100% cho màn hình điện thoại (mobile-first) và hiển thị tráng lệ trên máy tính bảng và desktop.

---

## 🌟 Tính Năng Nổi Bật

1. **Hiệu Ứng Mở Thiệp Điện Tử (Envelope Curtain & Wax Seal):**
   - Màn hình mở thiệp sang trọng với phong bì sáp niêm phong đỏ rượu vang.
   - Hiệu ứng rèm mở đôi (Curtain Opening) kết hợp pháo hoa giấy vàng (Golden Confetti) lung linh.
   - Nhạc cưới lãng mạn tự động phát khi người dùng chạm mở thiệp lần đầu (chống chính sách chặn autoplay của trình duyệt).

2. **Giao Diện Landing Page Cưới (Wedding Invitation Story):**
   - **Hero Section:** Ảnh cưới lớn, tên cô dâu & chú rể, câu danh ngôn tình yêu, đồng hồ đếm ngược (Countdown Ngày - Giờ - Phút - Giây).
   - **The Bride & Groom:** Chân dung cô dâu chú rể, thông tin song thân phụ mẫu, tiểu sử và mạng xã hội.
   - **Our Story:** Dòng thời gian tình yêu (Timeline 2019 - 2021 - 2024 - 2026) với hình ảnh và tự sự ngọt ngào.
   - **Wedding Events:** Lễ Thành Hôn & Tiệc Cưới chiêu đãi, địa chỉ, giờ giấc, nút **"Xem bản đồ Google Maps"** và **"Lưu vào Google Calendar"**.
   - **Our Memories Gallery:** Album ảnh phong cách Masonry, bộ lọc danh mục (Pre-wedding, Lễ cưới, Khoảnh khắc), Lightbox phóng to/thu nhỏ, Next/Previous và phím tắt.
   - **Wedding Gift (Mừng Cưới):** Thông tin tài khoản ngân hàng cô dâu chú rể, nút **"Sao chép số tài khoản"** (kèm thông báo Toast), mã **VietQR** chuẩn ngân hàng hỗ trợ phóng to quét mã.
   - **RSVP (Xác Nhận Tham Dự):** Biểu mẫu trực quan xác nhận số người đi cùng, khách nhà trai/nhà gái, lời nhắn chúc phúc.
   - **Wishes Guestbook (Sổ Lưu Bút):** Khách gửi lời chúc trực tuyến, thả tim lời chúc, gợi ý lời chúc nhanh tiện lợi.
   - **Nhạc Nền Tự Động (Background Music):** Nút xoay đĩa nhạc nổi, tích hợp bộ tạo âm hưởng Canon in D bằng Web Audio API không phụ thuộc file ngoài hoặc phát audio URL tuỳ chỉnh.
   - **Hiệu Ứng Cánh Hoa Rơi Nhẹ (Floating Petals):** Canvas animation bay lượn lãng mạn, 60fps mượt mà, không giật lag.

3. **Bảng Điều Khiển Quản Trị (/admin):**
   - Quản lý toàn bộ thông tin ngày cưới, địa điểm, câu quote, nhạc nền, slug đường dẫn riêng.
   - Thêm/sửa/xóa mốc câu chuyện và sự kiện cưới.
   - Quản lý album ảnh, tải file ảnh trực tiếp hoặc nhập URL, đổi thứ tự ảnh.
   - Tạo mã VietQR ngân hàng tự động.
   - Thống kê khách mời RSVP (Tổng số khách, xác nhận đến, báo bận, xuất file Excel/CSV).
   - Duyệt, ẩn hoặc xóa lời chúc lưu bút.
   - Thay đổi 5 bộ giao diện phong cách khác nhau: *Classic Luxury (Vàng & Kem), Romantic Rose (Hồng Vàng), Modern Minimal (Đen & Be), Vintage Elegance (Xanh Ngọc & Vàng Cổ), Royal Navy (Xanh Hoàng Gia & Champagne)*.
   - **Chế độ Live Preview:** Xem trước thiệp trên khung iPhone (390px), iPad (768px) và Desktop.

4. **Kiến Trúc Dữ Liệu Kép (Firebase Firestore + LocalStorage Fallback):**
   - Tích hợp sẵn Firebase Firestore cho lưu trữ đám mây bền vững.
   - Tự động chuyển đổi sang LocalStorage nếu chưa cấu hình Firebase, giúp chạy thử nghiệm mượt mà ngay lập tức.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Bước 1: Tải mã nguồn

```bash
git clone <repository-url>
cd wedding-invitation
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình Firebase (Tùy chọn)

1. Truy cập [Firebase Console](https://console.firebase.google.com/) và nhấn **Add project** (Tạo dự án mới).
2. Vào mục **Build** > **Firestore Database**, nhấn **Create database** (chọn chế độ production hoặc test).
3. Vào mục **Project settings** (biểu tượng bánh răng) > cuộn xuống phần **Your apps** > chọn biểu tượng Web `</>` để tạo Web App.
4. Sao chép các khóa cấu hình và tạo file `.env` (dựa trên `.env.example`):

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
```

5. Triển khai Firestore Security Rules:
Sao chép nội dung từ file `firestore.rules` và dán vào tab **Rules** trong Firebase Firestore Console, sau đó nhấn **Publish**.

*(Lưu ý: Nếu không cấu hình Firebase, website vẫn hoạt động 100% tính năng bằng bộ nhớ LocalStorage của trình duyệt).*

### Bước 4: Chạy môi trường phát triển (Development)

```bash
npm run dev
```

Mở trình duyệt truy cập:
- Xem thiệp cưới: `http://localhost:3000/wedding/minh-anh-ngoc-mai`
- Mở bảng quản trị: `http://localhost:3000/admin` (hoặc bấm nút "Quản Trị Thiệp" ở góc trái màn hình).

---

## 📦 Build & Triển Khai (Deploy)

### Build cho production

```bash
npm run build
```

Thư mục `dist/` sẽ được tạo ra chứa mã nguồn tĩnh tối ưu.

### Triển khai lên Vercel / Netlify / Cloudflare Pages

1. **Vercel:**
   - Kết nối repository GitHub với [Vercel](https://vercel.com).
   - Framework Preset: **Vite**.
   - Cấu hình Environment Variables theo file `.env` nếu có sử dụng Firebase.
   - Nhấn **Deploy**.

2. **Netlify:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Nhấn **Deploy site**.

---

## 🎨 Cấu Trúc Mã Nguồn

```
├── index.html                 # Entry point, Google Fonts, OpenGraph SEO
├── metadata.json              # App metadata
├── firestore.rules            # Zero-trust Firestore Security Rules
├── firebase-blueprint.json    # Firestore schema & entities blueprint
├── .env.example               # Mẫu biến môi trường
├── src/
│   ├── types/index.ts         # Khai báo TypeScript types
│   ├── lib/
│   │   ├── firebase.ts        # Firebase Client SDK & error handler
│   │   ├── audioSynth.ts      # Bộ tổng hợp nhạc Canon in D Web Audio API
│   │   └── utils.ts           # Hàm đếm ngược, định dạng ngày, copy STK
│   ├── data/
│   │   ├── demoWedding.ts     # Dữ liệu thiệp cưới mẫu phong phú
│   │   └── templates.ts       # 5 Theme màu thiệp cưới cao cấp
│   ├── services/
│   │   ├── weddingService.ts  # CRUD thông tin thiệp cưới
│   │   ├── rsvpService.ts     # Xử lý gửi & thống kê RSVP
│   │   └── wishesService.ts   # Xử lý sổ lưu bút & like
│   ├── components/
│   │   ├── ui/
│   │   │   ├── EnvelopeCurtain.tsx     # Màn hình mở thiệp & sáp niêm phong
│   │   │   ├── FloatingMusicPlayer.tsx # Trình phát nhạc nền lãng mạn
│   │   │   ├── PetalsFalling.tsx       # Hiệu ứng cánh hoa bay
│   │   │   ├── LightboxModal.tsx       # Phóng to xem ảnh album
│   │   │   └── Toast.tsx               # Thông báo sao chép, lưu thành công
│   │   ├── wedding/
│   │   │   ├── HeaderNav.tsx           # Thanh điều hướng sticky & monogram
│   │   │   ├── HeroSection.tsx         # Ảnh bìa, countdown, quote
│   │   │   ├── CoupleSection.tsx       # Giới thiệu cô dâu chú rể
│   │   │   ├── StorySection.tsx        # Dòng thời gian tình yêu (Timeline)
│   │   │   ├── EventsSection.tsx       # Lịch lễ thành hôn, tiệc chiêu đãi
│   │   │   ├── GallerySection.tsx      # Album ảnh Masonry & bộ lọc
│   │   │   ├── GiftSection.tsx         # Hộp mừng cưới, copy STK, VietQR
│   │   │   ├── RSVPSection.tsx         # Biểu mẫu xác nhận tham dự
│   │   │   ├── WishesSection.tsx       # Sổ lưu bút chúc phúc
│   │   │   ├── Footer.tsx              # Lời cảm ơn & bản quyền
│   │   │   └── WeddingPage.tsx         # Trang thiệp cưới tổng hợp
│   │   └── admin/
│   │       ├── AdminDashboard.tsx      # Bảng điều khiển quản trị
│   │       ├── StatsOverview.tsx       # Thống kê tổng quan RSVP & lời chúc
│   │       ├── WeddingInfoTab.tsx      # Chỉnh sửa thông tin chung & slug
│   │       ├── CoupleTab.tsx           # Chỉnh sửa cô dâu chú rể
│   │       ├── EventsTab.tsx           # Quản lý sự kiện
│   │       ├── StoryTab.tsx            # Quản lý dòng thời gian
│   │       ├── GalleryTab.tsx          # Quản lý ảnh kỷ niệm
│   │       ├── GiftTab.tsx             # Quản lý STK & VietQR tự động
│   │       ├── RSVPTab.tsx             # Bảng khách mời & xuất Excel/CSV
│   │       ├── WishesTab.tsx           # Duyệt & ẩn lời chúc
│   │       ├── TemplatesTab.tsx        # Lựa chọn 5 bộ giao diện
│   │       └── PreviewModal.tsx        # Xem trước Responsive đa thiết bị
│   ├── App.tsx                        # Router & State controller
│   └── main.tsx                       # React root entry
```

---

## 💖 Giấy Phép (License)
Apache-2.0 License.
