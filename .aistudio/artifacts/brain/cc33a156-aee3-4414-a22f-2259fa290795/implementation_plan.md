# Kế hoạch chi tiết: Thiệp cưới VIP 3D — The Royal Ring Vault

Thiết kế và triển khai mẫu thiệp cưới VIP thượng lưu độc bản với màn mở đầu tương tác 3D toàn màn hình (Three.js WebGL): Hộp nhẫn pha lê vát cạnh viền vàng hồng hoàng gia, cặp nhẫn kim cương khúc xạ quang phổ 7 màu, khắc tên riêng của khách VIP bằng tia laser phát sáng chuyển động và bùng nổ hiệu ứng bụi vàng cùng hoa nở xoay vòng khi mở khóa hộp.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Dựa trên lựa chọn và phản hồi của bạn trong phần tương tác, các quyết định thiết kế cốt lõi đã được xác lập:

- **Vị trí & Luồng xuất hiện**: Màn mở đầu toàn màn hình (Full-screen Cinematic Opening) bao trùm trải nghiệm người xem trước khi chuyển tiếp mượt mà vào toàn bộ nội dung thiệp cưới. Đồng thời hỗ trợ nút "Bỏ qua / Xem nhanh thiệp" để khách mời lớn tuổi hoặc người cần tra cứu thông tin địa điểm có thể truy cập tức thì.
- **Phong cách chất liệu & Thẩm mỹ**: Hộp pha lê vát cạnh tinh xảo (Beveled Crystal Glass) viền kim loại vàng hồng hoàng gia (Royal Rose Gold), lớp đệm nhung đen dạ yến (Obsidian Velvet Cushion) làm nổi bật vẻ đẹp lấp lánh của cặp nhẫn cưới.
- **Tập hợp 3 hiệu ứng ánh sáng độc quyền**:
  1. *Khúc xạ quang phổ 7 màu (Spectral Dispersion & Caustics)*: Viên kim cương solitaire phản chiếu tia sáng cầu vồng rực rỡ khi xoay 360°.
  2. *Khắc laser tên khách VIP phát sáng*: Tên khách mời (truy xuất tự động từ URL hoặc nhập tay) được vẽ bằng tia laser vàng lấp lánh lên dải ruy-băng bạch kim/vàng hồng trên đế nhẫn.
  3. *Bụi vàng hoàng kim & Hoa nở xoay vòng (Swirling Gold Dust & Blooming Petals)*: Khi nắp hộp mở ra, các hạt ánh sáng lấp lánh kết hợp cánh hoa hồng bay xoay quanh trục z bung tỏa ngoạn mục.

---

## 1. Overview & Core Concept

- **Tên trải nghiệm**: **The Royal Ring Vault** (Kho Báu Nhẫn Cưới Hoàng Gia).
- **Mục tiêu**: Nâng tầm thiệp cưới trực tuyến thành một tác phẩm nghệ thuật 3D tương tác đẳng cấp thế giới, mang lại cảm xúc trang trọng, danh giá cho từng vị khách mời VIP.
- **Khán giả & Trải nghiệm người dùng**:
  - Khách mời VIP nhận được liên kết thiệp cá nhân hóa (`?guest=Ong+Ba+Nguyen+Van+A&vip=1`).
  - Mở ra một sân khấu 3D lộng lẫy, cảm giác như đang nhận tận tay một chiếc hộp trang sức kim hoàn cao cấp nhất thế giới.
  - Tự do tương tác chạm, xoay, mở hộp nhẫn để xem lời mời riêng, sau đó tiến vào hành trình đám cưới (Lịch trình, Bản đồ thông minh, Album ảnh, Gửi lời chúc, Mừng cưới QR).

---

## 2. User Experience & Visual Design

### A. Key User Flows (Hành trình trải nghiệm)

```
┌────────────────────────────────────────────────────────────────────────┐
│ Giai đoạn 1: Màn đêm dạ yến tĩnh mịch                                  │
│ - Hộp pha lê viền vàng hồng nổi lơ lửng, ánh sáng studio lướt nhẹ qua. │
│ - Đèn spotlight chiếu rọi cặp nhẫn bên trong lớp kính mờ ảo.          │
│ - Dòng chữ khắc tên khách: "Kính mời [Tên Khách VIP] mở hộp danh dự"  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Giai đoạn 2: Tương tác mở khóa & Bung nổ hiệu ứng                      │
│ - Khách chạm/vuốt hoặc nhấn nút "Mở Hộp Nhẫn Hoàng Gia".               │
│ - Khóa chốt vàng hồng bật nhẹ (âm thanh cơ khí click trong trẻo).      │
│ - Nắp pha lê nâng lên và xoay nghiêng theo bản lề vật lý.              │
│ - Hàng nghìn hạt bụi vàng (Gold Stardust) bùng nổ xoay tròn.          │
│ - Cánh hoa hồng nở bung từ đế nhung và bay lượn quanh màn hình.       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Giai đoạn 3: Chiêm ngưỡng cặp nhẫn kim cương 360°                      │
│ - Bệ nhung nâng cặp nhẫn lên vị trí tiêu điểm camera.                  │
│ - Tia laser vàng chuyển động khắc tên Cô Dâu - Chú Rể & Khách VIP.     │
│ - Người xem có thể kéo xoay tự do để ngắm hiệu ứng khúc xạ 7 màu.      │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Giai đoạn 4: Chuyển tiếp mượt mà vào Thiệp cưới chính thức             │
│ - Nút "Khám Phá Thiệp Cưới" xuất hiện cùng tiếng nhạc du dương.        │
│ - Camera lướt qua cặp nhẫn (zoom-in dive) hòa tan vào thiệp cưới VIP.   │
│ - Khách có thể mở lại Hộp Nhẫn bất kỳ lúc nào qua nút nổi trên thanh HUD.│
└────────────────────────────────────────────────────────────────────────┘
```

### B. Visual Identity & Palette (Bộ màu sắc & Ánh sáng)
- **Màu nền không gian (60%)**: Đen dạ yến huyền bí (`#0D0B0E`) pha chút sắc tím than sâu thẳm (`#161219`) giúp tôn bật độ trong suốt và phản chiếu của pha lê.
- **Màu cấu trúc & Kim loại (30%)**: Vàng hồng hoàng gia hoàng kim (`#E8B498`, `#DDA789`, `#B87B5C`), kính pha lê sapphire với viền bevel sáng bóng.
- **Màu điểm nhấn (10%)**: Ánh kim cương khúc xạ quang phổ (`#FFE6A3`, `#A3D8FF`, `#FFBEEF`, `#FFF3D6`), hạt bụi vàng lấp lánh (`#FDE047`).
- **Typography**: 
  - Tiêu đề & Tên thiệp: `Cormorant Garamond` / `Playfair Display` kiêu sa, quý phái.
  - Phụ đề & Lời dẫn: `Plus Jakarta Sans` thanh lịch, giãn cách chữ tinh tế (`tracking-widest`).

---

## 3. Key Product Decisions & Special Effects Strategy

### Quyết định 1: Tạo mô hình 3D hoàn toàn bằng Procedural Three.js (Không dùng file .GLB nặng)
- **Phương án chọn**: Lập trình tạo hình học toán học 100% trong Three.js (`BoxGeometry` vát cạnh, `TorusGeometry` cho nhẫn, `OctahedronGeometry` / `CylinderGeometry` đa giác mặt vát cho kim cương solitaire, `CylinderGeometry` cho bệ nhung).
- **Lý do**: File `.glb` đồ họa kim cương thường nặng từ 5MB - 15MB, làm người dùng điện thoại 4G phải chờ đợi lâu và dễ bị lỗi tải. Mô hình Procedural chỉ tốn **vài chục KB mã nguồn**, dựng tức thì trong 0.2 giây, cực kỳ mượt mà.
- **Tránh rủi ro**: Zero 404, không phụ thuộc vào hosting tài nguyên bên ngoài.

### Quyết định 2: Công nghệ vật liệu PBR cao cấp (`MeshPhysicalMaterial` & Shader)
- **Kim cương (Diamond Solitaire)**:
  - `transmission: 0.96`, `ior: 2.417` (chỉ số khúc xạ kim cương thật), `roughness: 0.0`, `metalness: 0.1`, `thickness: 1.2`.
  - Shader mở rộng hoặc hiệu ứng ánh sáng xoay tạo dải tán sắc quang học (chromatic dispersion) đổi màu xanh - vàng - hồng lấp lánh khi góc nhìn thay đổi.
- **Hộp pha lê vát cạnh (Beveled Crystal)**:
  - `transmission: 0.92`, `ior: 1.52`, `roughness: 0.05`, `reflectivity: 0.9`, bóng viền vàng hồng kim loại (`metalness: 0.95`, `roughness: 0.15`).
- **Môi trường phản xạ**: Tích hợp `RoomEnvironment` + `PMREMGenerator` để các bề mặt kim loại và kính có ánh phản chiếu studio chuyên nghiệp mà không cần tải ảnh HDR bên ngoài.

### Quyết định 3: Hệ thống Hạt bụi vàng & Cánh hoa bung nở (Custom Particle Engine)
- Sử dụng `THREE.InstancedMesh` hoặc `THREE.Points` tối ưu:
  - 400 hạt bụi vàng (`Gold Stardust`) xoay quanh hộp theo phương trình xoắn ốc Fibonacci và trôi bồng bềnh.
  - 30 cánh hoa hồng lụa rơi và xoay lượn tự nhiên quanh bệ nhẫn khi nắp mở ra.
  - Âm thanh Web Audio API tổng hợp tiếng cơ khí "click" sang trọng khi mở chốt và tiếng chuông pha lê ngân vang êm dịu.

---

## 4. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App.tsx (Routing / State)                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               WeddingPage.tsx (Trang thiệp cưới chính)                 │
│  - Kiểm tra trạng thái: showVaultOpening (mặc định: true cho mẫu VIP)  │
│  - Truy xuất thông tin khách mời VIP: getGuestPersonalization()        │
└───────────┬────────────────────────────────────────────────┬───────────┘
            │                                                │
    (Khi showVaultOpening = true)                 (Khi đã mở hộp vào thiệp)
            │                                                │
            ▼                                                ▼
┌─────────────────────────────────────────┐  ┌───────────────────────────┐
│  RoyalRingVaultOpening.tsx (Toàn màn)   │  │ RoyalRingVaultTemplate.tsx│
│  ┌────────────────────────────────────┐ │  │ - HeaderNav & Floating HUD│
│  │ Three.js Canvas Container          │ │  │ - HeroSection VIP         │
│  │ ├─ Studio Lighting & Environment   │ │  │ - Cặp đôi & Câu chuyện    │
│  │ ├─ BeveledCrystalBox (Nắp & Thân)  │ │  │ - Lịch trình sự kiện      │
│  │ ├─ VelvetCushion & GoldenPlaque    │ │  │ - Album ảnh kỷ niệm       │
│  │ ├─ SolitaireDiamondRings (Xoay 360)│ │  │ - RSVP & Lời chúc         │
│  │ ├─ LaserEngravingEmitter (Tên VIP) │ │  │ - Hộp mừng cưới VietQR    │
│  │ └─ SwirlingGoldDust & Petals (FX)  │ │  │ - Nút "Xem lại Hộp Nhẫn 3D│
│  └────────────────────────────────────┘ │  └───────────────────────────┘
│  ┌────────────────────────────────────┐ │
│  │ DOM HUD Overlay                    │ │
│  │ - Lời mời trân trọng theo tên khách│ │
│  │ - Nút "Mở Hộp Nhẫn" / "Xoay Nhẫn"  │ │
│  │ - Nút "Bỏ qua & Xem thiệp ngay"    │ │
│  │ - Bộ điều khiển âm thanh du dương  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 5. Danh mục các công việc triển khai cụ thể

1. **Cài đặt thư viện 3D**:
   - Cài đặt `three` và `@types/three` qua lệnh `install_applet_package`.
2. **Xây dựng module 3D procedural `RoyalRingVaultScene.ts`**:
   - Thiết lập Scene, Camera với orbit damping mượt mà.
   - Thiết lập Studio 3-point Lighting, `RoomEnvironment` tạo vệt sáng phản chiếu kim hoàn.
   - Dựng mô hình hộp pha lê vát cạnh với nắp mở bản lề có khớp xoay (`THREE.Group`).
   - Dựng cặp nhẫn cưới bằng `TorusGeometry` vàng hồng với viên kim cương giác cắt Brilliant bằng hình học vát đa diện.
   - Thêm hiệu ứng hạt bụi vàng lấp lánh và cánh hoa xoay tròn khi mở nắp.
   - Shader / Texture Canvas vẽ tia laser khắc tên khách mời VIP lên thẻ bài kim loại.
3. **Xây dựng Component `RoyalRingVaultOpening.tsx`**:
   - Giao diện mở màn toàn màn hình với hiệu ứng làm mờ chuyển cảnh (cinematic fade-out).
   - HUD điều khiển tối giản ở đáy màn hình theo đúng quy chuẩn thiết kế, không che khuất góc nhìn 3D.
   - Xử lý tương tác vuốt xoay trên điện thoại cảm ứng và chuột máy tính.
4. **Tích hợp vào hệ thống Mẫu Thiệp cưới & Danh mục Template**:
   - Đăng ký template mới `royal-ring-vault` vào `src/data/templates.ts` thuộc phân hạng VIP.
   - Tạo `RoyalRingVaultTemplate.tsx` phối hợp hài hòa phong cách hoàng gia vàng hồng - đen nhung sang trọng.
   - Tích hợp nút xem lại Hộp nhẫn 3D tại thanh điều hướng hoặc khu vực Lễ Thành Hôn.
5. **Kiểm thử & Tối ưu hóa**:
   - Kiểm tra hiệu năng 60 FPS trên thiết bị di động, tự động giảm tải hạt bụi khi phát hiện FPS thấp.
   - Đảm bảo kiểm tra TypeScript (`compile_applet`) không có lỗi.
